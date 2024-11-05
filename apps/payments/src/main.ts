import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { PaymentsModule } from './payments.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('AMQP_URL')],
      queue: 'payments_queue',
    },
  });

  await app.startAllMicroservices().catch((err) => {
    console.error('Failed to start microservices:', err);
  });
}

bootstrap();
