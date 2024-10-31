import { ConfigModule, PrismaModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
import { PromocodesModule } from '../../promocodes/src/promocodes.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GoodsModule,
    PrismaModule,
    ConfigModule,
    AuthModule,
    UserModule,
    AdminModule,
    PromocodesModule,
  ],
})
export class AppModule {}
