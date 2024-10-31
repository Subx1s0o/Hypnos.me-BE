import { NestFactory } from '@nestjs/core';
import { PromocodesModule } from './promocodes.module';

async function bootstrap() {
  const app = await NestFactory.create(PromocodesModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
