import { PrismaService } from '@/libs/common';
import { Injectable } from '@nestjs/common/decorators';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Role } from '@/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const userId = context.switchToHttp().getRequest().user;

    if (!userId) {
      throw new ForbiddenException('User ID not found in request');
    }

    const user = await this.prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ForbiddenException('User not found to process request');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access denied: only accessible to users with role ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
