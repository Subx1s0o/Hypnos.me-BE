import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, catchError, Observable, throwError } from 'rxjs';
import { LogsRepository } from './database/repositories/logs.repository';
import {
  AppException,
  AppExceptionContext,
} from './core/exceptions/app.exception';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppInterceptor implements NestInterceptor {
  constructor(private readonly logsRepository: LogsRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controller = context.getClass();
    const methodArgs = context.getArgs();

    const contextInfo: AppExceptionContext = {
      className: controller.name,
      methodName: handler.name,
      body: request.body,
      params: request.params,
      query: request.query,
      user: request.user,
    };

    return next.handle().pipe(
      map((data) => ({ data, statusCode: 200 })),
      catchError((error) => {
        const rrn = uuidv4();
        const errorName = `${contextInfo.className}.${contextInfo.methodName}`;

        this.logsRepository
          .logError(
            errorName,
            {
              message: error.message,
              stack: error.stack,
              statusCode: error.status || 500,
              context: contextInfo,
              methodArgs: methodArgs,
              originalError: error.name,
              timestamp: new Date().toISOString(),
            },
            rrn,
          )
          .catch((logError) => {
            console.error('Failed to log error to database:', logError);
          });

        if (error instanceof AppException) {
          return throwError(() => error);
        }

        const appException = new AppException(
          error.message || 'Internal server error',
          error.status || 500,
          contextInfo,
          rrn,
        );

        return throwError(() => appException);
      }),
    );
  }
}
