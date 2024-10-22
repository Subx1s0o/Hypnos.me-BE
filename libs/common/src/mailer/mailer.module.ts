import { MailerModule as NodeMailer } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MailerService } from './mailer.service';
@Module({
  imports: [
    NodeMailer.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST') as string,
          port: 587,
          auth: {
            user: configService.get('MAILER_USERNAME') as string,
            pass: configService.get('MAILER_PASSWORD') as string,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
