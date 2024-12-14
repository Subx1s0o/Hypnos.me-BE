import { MailerModule as NodeMailer } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MjmlAdapter } from '@nestjs-modules/mailer/dist/adapters/mjml.adapter';
import mjml2html from 'mjml';

@Module({
  imports: [
    NodeMailer.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: configService.get('MAILER_USERNAME'),
            pass: configService.get('MAILER_PASSWORD'),
          },
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new MjmlAdapter({
            compile: (template: string) => {
              return {
                render: () => {
                  const { html } = mjml2html(template);
                  return html;
                },
              };
            },
          }),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MailerModule {}
