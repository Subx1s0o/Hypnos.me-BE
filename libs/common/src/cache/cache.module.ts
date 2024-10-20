import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '../config/config.service';
import { CacheService } from './cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get('REDIS_STORE'),
        no_ready_check: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
