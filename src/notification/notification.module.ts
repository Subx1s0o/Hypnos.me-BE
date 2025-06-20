import { MailerModule as NodeMailer } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MjmlAdapter } from '@nestjs-modules/mailer/dist/adapters/mjml.adapter';
import mjml2html from 'mjml';
import { config } from '@/core/config';

@Global()
@Module({
  imports: [
    NodeMailer.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: config.mailer.host,
          port: 587,
          secure: false,
          auth: {
            user: config.mailer.username,
            pass: config.mailer.password,
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
    }),
  ],
})
export class NotificationModule {}
