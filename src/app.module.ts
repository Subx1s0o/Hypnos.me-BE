import { Module } from '@nestjs/common/decorators';
import { PromocodesModule } from './promocodes/promocodes.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { UserModule } from './user/user.module';
import { RecomendationsModule } from './recomendations/recomendations.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GATEWAY_COMPONENTS } from './app.gateway-components';
import { config } from './core/config';
import { WORKER_PROCESSORS, WORKER_SCHEDULERS } from './app.worker-components';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from './cache/cache.module';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    AuthModule,
    UserModule,
    AdminModule,
    PaymentsModule,
    PromocodesModule,
    ReviewsModule,
    CacheModule,
    NotificationModule,
    RecomendationsModule,
    EventEmitterModule.forRoot({
      global: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => ({
        secret: config.jwt.secret,
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: Number(config.redis.port),
        password: config.redis.password || '',
        username: config.redis.username || '',
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  controllers: [...(config.role === 'GATEWAY' ? GATEWAY_COMPONENTS : [])],
  providers: [
    ...(config.role === 'WORKER' ? WORKER_PROCESSORS : []),
    ...(config.role === 'WORKER' ? WORKER_SCHEDULERS : []),
  ],
})
export class AppModule {}
