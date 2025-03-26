import {
  applyDecorators,
  SetMetadata,
  UseGuards,
} from '@nestjs/common/decorators/core';
import { Role } from '@/types';
import { NonNecessaryAuthGuard } from '../guards/non-necessary-auth.guard';
import { NonNecessaryRolesGuard } from '../guards/non-necessary-roles.guard';

export const NonNecessaryAuth = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata('roles', roles.length ? roles : null),
    UseGuards(
      NonNecessaryAuthGuard,
      ...(roles.length ? [NonNecessaryRolesGuard] : []),
    ),
  );
};
