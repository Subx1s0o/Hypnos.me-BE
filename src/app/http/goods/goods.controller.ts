import { Auth } from '@/libs/entities/decorators';
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

import { CategoriesType, Good, GoodPreview } from 'src/types';
import { CreateGoodDto } from './dto/create.dto';
import { UpdateGoodDto } from './dto/update';
import { GoodsService } from './goods.service';
import { ParseCategoryPipe } from '@/libs/entities/pipes/categories.pipe';
import { Request } from 'express';
import { MEDIA_NAMES } from '@/libs/entities';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getAllGoods(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category', new ParseCategoryPipe()) category?: CategoriesType,
    @Query('search') search?: string,
  ): Promise<{ data: GoodPreview[]; totalPages: number }> {
    return await this.goodsService.getAllGoods({
      page,
      limit,
      category,
      search,
    });
  }

  @Get(':slug')
  async getGood(@Param('slug') slug: string, @Req() req: Request) {
    return await this.goodsService.getGood(slug, req);
  }

  @Post()
  @HttpCode(204)
  // @Auth('admin', 'owner')
  async createGood(@Body() data: CreateGoodDto): Promise<Good> {
    return await this.goodsService.createGood(data);
  }

  @Patch(':id')
  @HttpCode(204)
  // @Auth('admin', 'owner')
  async updateGood(
    @Param('id') id: string,
    @Body() data: UpdateGoodDto,
  ): Promise<void> {
    await this.goodsService.updateGood(id, data);
    return null;
  }

  @Patch('/media/:mediaId')
  @HttpCode(200)
  // @Auth('admin', 'owner')
  async uploadMedia(
    @Param('mediaId') mediaId: string,
    @Body() data: { [key in MEDIA_NAMES]: string },
  ): Promise<void> {
    return await this.goodsService.uploadMedia(mediaId, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth('admin', 'owner')
  async deleteGood(@Param('id') id: string): Promise<void> {
    await this.goodsService.deleteGood(id);
    return null;
  }
}
