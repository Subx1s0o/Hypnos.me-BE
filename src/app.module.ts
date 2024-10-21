import { ConfigModule, PrismaModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
@Module({
  imports: [GoodsModule, PrismaModule, ConfigModule, AuthModule],
})
export class AppModule {}
