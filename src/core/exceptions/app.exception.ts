import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface AppExceptionContext {
  className: string;
  methodName: string;
  body?: any;
  params?: any;
  query?: any;
  user?: any;
}

export class AppException extends HttpException {
  public readonly context: AppExceptionContext;
  public readonly timestamp: Date;
  public readonly rrn: string;

  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    context: AppExceptionContext,
    rrn?: string,
  ) {
    super(message, status);
    this.context = context;
    this.timestamp = new Date();
    this.rrn = rrn || this.generateRRN();
  }

  private generateRRN(): string {
    return uuidv4();
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.getStatus(),
      timestamp: this.timestamp,
      rrn: this.rrn,
      context: this.context,
    };
  }
}
