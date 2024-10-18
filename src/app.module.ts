import { PrismaModule } from '@lib/common/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { GoodsModule } from './goods/goods.module';
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
      store: redisStore,
      url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,

      no_ready_check: true,
    }),
    GoodsModule,
    PrismaModule,
  ],
})
export class AppModule {}
