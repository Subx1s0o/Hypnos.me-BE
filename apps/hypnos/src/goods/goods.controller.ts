import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoodsService } from './goods.service';

@Controller('goods')
@ApiTags('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  // @Get()
  // async getAllGoods() {
  //   return await this.goodsService.getAllGoods();
  // }

  // @Post()
  // @Auth('admin')
  // async createGood(data: CreateGoodDto) {
  //   return await this.goodsService.createGood(data);
  // }

  @Post()
  sayHello(@Body() data: string) {
    return this.goodsService.sayHello(data);
  }
}
