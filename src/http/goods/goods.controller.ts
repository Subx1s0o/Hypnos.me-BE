import { Auth } from '@lib/entities/decorators';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesType, GoodPreview } from 'types';
import { CreateGoodDto } from './dto/create.dto';
import { UpdateGoodDto } from './dto/update';
import { GoodsService } from './goods.service';
import { ParseCategoryPipe } from './helpers/categories.pipe';
import { SearchDto } from './dto';
import { Request } from 'express';

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
  ): Promise<{ data: GoodPreview[]; totalPages: number }> {
    return await this.goodsService.getAllGoods({
      page,
      limit,
      category,
    });
  }

  @Get('search')
  async searchGood(@Body() data: SearchDto) {
    return await this.goodsService.search(data);
  }

  @Get(':slug')
  async getGood(@Param('slug') slug: string, @Req() req: Request) {
    return await this.goodsService.getGood(slug, req);
  }

  @Post()
  @HttpCode(204)
  // @Auth('admin', 'owner')
  async createGood(@Body() data: CreateGoodDto): Promise<void> {
    await this.goodsService.createGood(data);
    return null;
  }

  @Patch(':id')
  @HttpCode(204)
  @Auth('admin', 'owner')
  async updateGood(
    @Param('id') id: string,
    @Body() data: UpdateGoodDto,
  ): Promise<void> {
    await this.goodsService.updateGood(id, data);
    return null;
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth('admin', 'owner')
  async deleteGood(@Param('id') id: string): Promise<void> {
    await this.goodsService.deleteGood(id);
    return null;
  }
}
