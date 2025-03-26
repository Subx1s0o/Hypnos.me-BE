import { Logger, Module } from '@nestjs/common';
import { ViewedProductsController } from './viwedProducts.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/libs/common';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ViewedProductsController],
  providers: [Logger],
})
export class ViewedProductsModule {}
