import PrismaService from '@lib/common/prisma/prisma.service';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
} from '@nestjs/cache-manager';
import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller('goods')
export class GoodsController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('goods')
  async getAllGoods() {
    return this.prisma.song.findMany();
  }

  @Get('cache')
  async getCache() {
    return await this.cache.store.keys();
  }

  @Get('reset')
  async reset() {
    return await this.cache.reset();
  }
}
