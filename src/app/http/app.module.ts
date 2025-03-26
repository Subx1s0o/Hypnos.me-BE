import { ConfigModule, PrismaModule } from '@/libs/common';
import { Module } from '@nestjs/common/decorators';

import { PromocodesModule } from './promocodes/promocodes.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { GoodsModule } from './goods/goods.module';
import { PaymentsModule } from './payments/payments.module';
import { UserModule } from './user/user.module';
import { RecomendationsModule } from './recomendations/recomendations.module';
import { ReviewsModule } from './reviews/reviews.module';

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
    ReviewsModule,
    RecomendationsModule,
  ],
})
export class AppModule {}
