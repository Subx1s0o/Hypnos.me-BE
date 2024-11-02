import { NestFactory } from '@nestjs/core';
import { PromocodesModule } from './promocodes.module';

async function bootstrap() {
  const app = await NestFactory.create(PromocodesModule);
  await app.listen(5003);
}
bootstrap();
