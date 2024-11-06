import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CloudinaryModule } from './cloudinary.module';

async function bootstrap() {
  const app = await NestFactory.create(CloudinaryModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('AMQP_URL')],
      queue: 'cloudinary_queue',
    },
  });

  await app.startAllMicroservices().catch((err) => {
    console.error('Failed to start microservice:', err);
  });
}

bootstrap();
