// import { Auth } from '@lib/entities/decorators/Auth';
import { Auth, CATEGORIES } from '@lib/entities';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGoodDto } from './dto/create.dto';
import { UpdateOrAddDto } from './dto/update.dto';
import { GoodsService } from './goods.service';
@Controller('goods')
@ApiTags('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  async getAllGoods(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: CATEGORIES,
  ) {
    return await this.goodsService.getAllGoods({ page, limit, category });
  }

  @Post()
  @Auth('admin')
  async createGood(@Body() data: CreateGoodDto) {
    return await this.goodsService.createGood(data);
  }

  @Patch('images/:id')
  async updateOrAddImage(
    @Param('id') id: string,
    @Body() data: UpdateOrAddDto,
  ) {
    return await this.goodsService.changeOrAddImage({ id, data });
  }
}
