import { Auth } from '@lib/entities/decorators';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesType, Good } from 'types';
import { CreateGoodDto } from './dto/create.dto';
import { UpdateGoodDto } from './dto/update';
import { GoodsService } from './goods.service';
import { ParseCategoryPipe } from './helpers/categories.pipe';
@Controller('goods')
@ApiTags('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getAllGoods(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category', new ParseCategoryPipe()) category?: CategoriesType,
  ): Promise<{ data: Good[]; totalPages: number }> {
    return await this.goodsService.getAllGoods({
      page,
      limit,
      category,
    });
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

  @Delete(':id')
  @Auth('admin')
  async deleteGood(@Param('id') id: string): Promise<void> {
    return this.goodsService.deleteGood(id);
  }
}
