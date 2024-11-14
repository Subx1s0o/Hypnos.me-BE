import { ConfigService } from '@lib/common';
import { MailerModule } from '@lib/common/mailer/mailer.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelpersService } from './helpers/auth-helpers.service';
@Module({
  imports: [
    MailerModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') as string,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('REDIS_STORE') as string,
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'referral-queue',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelpersService],
  exports: [AuthService],
})
export class AuthModule {}
