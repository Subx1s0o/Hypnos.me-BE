import { ConfigModule, PrismaModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
import { OwnerModule } from './owner/owner.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GoodsModule,
    PrismaModule,
    ConfigModule,
    AuthModule,
    UserModule,
    OwnerModule,
    PromocodesModule,
  ],
})
export class AppModule {}
