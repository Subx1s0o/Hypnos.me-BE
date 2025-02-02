import {
  applyDecorators,
  SetMetadata,
  UseGuards,
} from '@nestjs/common/decorators/core';
import { Role } from '@/types';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata('roles', roles.length ? roles : null),
    UseGuards(AuthGuard, ...(roles.length ? [RolesGuard] : [])),
  );
};
