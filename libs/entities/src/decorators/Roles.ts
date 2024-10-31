import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../enum/roles';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: [RolesEnum, ...RolesEnum[]]) =>
  SetMetadata(ROLES_KEY, roles);
