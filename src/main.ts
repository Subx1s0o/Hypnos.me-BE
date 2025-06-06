import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from './core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });

  app.init();

  if (config.role === 'GATEWAY') {
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    const config = new DocumentBuilder()
      .setTitle('Jewelry Store')
      .setDescription('The Jewelry Store API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT || 8080);
  }
}

bootstrap();
