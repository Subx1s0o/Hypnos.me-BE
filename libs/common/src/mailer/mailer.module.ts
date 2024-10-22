import { MailerModule as NodeMailer } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    NodeMailer.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST') as string,
          port: 587,
          secure: false,
          auth: {
            user: configService.get('MAILER_USERNAME') as string,
            pass: configService.get('MAILER_PASSWORD') as string,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MailerModule {}
