import { ConfigModule, PrismaModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    GoodsModule,
    PrismaModule,
    ConfigModule,
    AuthModule,
    PromocodesModule,
    UserModule,
    AdminModule,
  ],
})
export class AppModule {}
