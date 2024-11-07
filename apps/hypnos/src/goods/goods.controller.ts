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
import { Good } from 'types';
import { CreateGoodDto } from './dto/create.dto';
import { CategoryDto, UpdateGoodDto } from './dto/update';
import { UpdateOrAddDto } from './dto/update-or-add.dto';
import { GoodsService } from './goods.service';
@Controller('goods')
@ApiTags('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  async getAllGoods(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category') provided_category?: CategoryDto,
  ): Promise<Good[]> {
    const { category } = provided_category;
    return await this.goodsService.getAllGoods({ page, limit, category });
  }

  @Post()
  @Auth('admin')
  async createGood(@Body() data: CreateGoodDto): Promise<Good> {
    return await this.goodsService.createGood(data);
  }

  @Patch(':id')
  @Auth('admin')
  async updateGood(
    @Param('id') id: string,
    @Body() data: UpdateGoodDto,
  ): Promise<Good> {
    return await this.goodsService.updateGood(id, data);
  }

  @Patch('images/:id')
  @Auth('admin')
  async updateOrAddImage(
    @Param('id') id: string,
    @Body() data: UpdateOrAddDto,
  ): Promise<void> {
    return await this.goodsService.changeOrAddImage({ id, data });
  }
}
