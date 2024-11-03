import { Auth } from '@lib/entities/decorators/Auth';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGoodDto } from './dto/create.dto';
import { GoodsService } from './goods.service';
@Controller('goods')
@ApiTags('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  async getAllGoods() {
    return await this.goodsService.getAllGoods();
  }

  @Post()
  @Auth('admin')
  async createGood(@Body() data: CreateGoodDto) {
    return await this.goodsService.createGood(data);
  }
}
