import { ConfigModule, PrismaModule } from '@lib/common';
import { Module } from '@nestjs/common/decorators';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import { PromocodesModule } from './promocodes/promocodes.module';

@Module({
  imports: [
    GoodsModule,
    PrismaModule,
    ConfigModule,
    AuthModule,
    UserModule,
    AdminModule,
    PaymentsModule,
    PromocodesModule,
  ],
})
export class AppModule {}
