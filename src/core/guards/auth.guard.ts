import { Injectable } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common';
import { AppException } from '@/core/exceptions/app.exception';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from '@/core/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AppException(
        "The Token isn't provided",
        HttpStatus.UNAUTHORIZED,
        {
          className: this.constructor.name,
          methodName: this.canActivate.name,
        },
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.jwt.secret,
      });

      request['user'] = {
        id: payload.id,
        role: payload.role,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AppException(
          'The Token is Expired, Please Sign-In',
          HttpStatus.UNAUTHORIZED,
          {
            className: this.constructor.name,
            methodName: this.canActivate.name,
          },
        );
      } else {
        throw new AppException(
          'The Token is Invalid, Please Sign-In',
          HttpStatus.UNAUTHORIZED,
          {
            className: this.constructor.name,
            methodName: this.canActivate.name,
          },
        );
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
