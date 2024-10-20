import { ConfigModule, PrismaModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { GoodsModule } from './goods/goods.module';
@Module({
  imports: [GoodsModule, PrismaModule, ConfigModule],
})
export class AppModule {}
