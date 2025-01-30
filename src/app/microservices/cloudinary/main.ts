import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CloudinaryModule } from './cloudinary.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CloudinaryModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AMQP_URL || 'amqp://localhost:5672'],
        queue: 'cloudinary_queue',
      },
    },
  );

  await app.listen();
}

bootstrap();
