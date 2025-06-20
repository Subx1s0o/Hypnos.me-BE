import { Injectable } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common';
import { AppException } from '@/core/exceptions/app.exception';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Role } from 'types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = context.switchToHttp().getRequest().user;

    if (!user) {
      throw new AppException(
        'User ID not found in request',
        HttpStatus.FORBIDDEN,
        {
          className: this.constructor.name,
          methodName: this.canActivate.name,
        },
      );
    }

    if (!user) {
      throw new AppException(
        'User not found to process request',
        HttpStatus.FORBIDDEN,
        {
          className: this.constructor.name,
          methodName: this.canActivate.name,
        },
      );
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRole) {
      throw new AppException(
        `Access denied: only accessible to users with role ${requiredRoles.join(', ')}`,
        HttpStatus.FORBIDDEN,
        {
          className: this.constructor.name,
          methodName: this.canActivate.name,
        },
      );
    }

    return true;
  }
}
