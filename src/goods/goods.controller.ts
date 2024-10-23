import { CacheService, PrismaService } from '@lib/common';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('goods')
@ApiTags('goods')
export class GoodsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('goods')
  async getAllGoods() {
    const goods = await this.prisma.products.findMany();
    return goods;
  }

  @Get('cache')
  async getCache() {
    return await this.cache.getKeys();
  }

  @Get('reset')
  async reset() {
    return await this.cache.reset();
  }
}
