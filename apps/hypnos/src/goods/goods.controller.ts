import { Auth } from '@lib/entities/decorators';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesType, Good } from 'types';
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
    @Query('category') category?: CategoriesType,
  ): Promise<Good[]> {
    return await this.goodsService.getAllGoods({ page, limit, category });
  }

  @Post()
  @Auth('admin')
  async createGood(@Body() data: CreateGoodDto): Promise<Good> {
    return await this.goodsService.createGood(data);
  }

  @Patch('images/:id')
  @Auth('admin')
  async updateOrAddImage(
    @Param('id') id: string,
    @Body() data: UpdateOrAddDto,
  ) {
    return await this.goodsService.changeOrAddImage({ id, data });
  }
}
