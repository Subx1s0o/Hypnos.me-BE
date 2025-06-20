import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthHelpersService } from './helpers/auth-helpers.service';

@Module({
  providers: [AuthService, AuthHelpersService],
  exports: [AuthService],
})
export class AuthModule {}
