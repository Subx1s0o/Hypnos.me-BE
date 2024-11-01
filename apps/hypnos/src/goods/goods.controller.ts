import { PrismaService } from '@lib/common';
import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('goods')
@ApiTags('goods')
export class GoodsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getAllGoods() {
    const goods = await this.prisma.products.findMany();
    return goods;
  }

  @Post()
  async createGood() {}
}
