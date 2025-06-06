import { Auth } from '@/core/decorators/Auth';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common/decorators';

import { AuthRequest, CategoriesType, Good, GoodPreview } from 'types';
import { UpdateGoodDto } from './dto/update';
import { ProductsService } from './products.service';
import { ParseCategoryPipe } from '@/core/pipes/categories.pipe';
import { NonNecessaryAuth } from '@/core/decorators/NonNecessaryAuth';
import { ProductCatalogQueryDto } from './dto/product-catalog-query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('goods')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getAllGoods(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('category', new ParseCategoryPipe()) category?: CategoriesType,
    @Query('search') search?: string,
  ): Promise<{ data: GoodPreview[]; totalPages: number; count: number }> {
    return await this.productsService.getAllGoods({
      page,
      limit,
      category,
      search,
    });
  }

  @Get('catalog')
  async getCatalog(
    @Query() queries: ProductCatalogQueryDto,
  ): Promise<{ data: GoodPreview[]; totalPages: number; count: number }> {
    return await this.productsService.getCatalog(queries);
  }

  @Auth()
  @HttpCode(200)
  @Get('viewed')
  async getViewedGoods(@Req() req: AuthRequest): Promise<Good[]> {
    return await this.productsService.getViewedGoods(req.user.id);
  }

  @Get(':slug')
  @NonNecessaryAuth()
  async getGood(
    @Param('slug') slug: string,
    @Req() req: AuthRequest,
  ): Promise<Good> {
    this.eventEmitter.emit('viewed', {
      user: req.user?.id || null,
      slug,
    });

    return await this.productsService.getGood(slug);
  }

  // @Post()
  // @HttpCode(204)
  // @Auth('admin', 'owner')
  // async createGood(@Body() data: CreateGoodDto): Promise<Good> {
  //   return await this.goodsService.createGood(data);
  // }

  @Patch(':id')
  @HttpCode(204)
  @Auth()
  async updateGood(
    @Param('id') id: string,
    @Body() data: UpdateGoodDto,
  ): Promise<void> {
    await this.productsService.updateGood(id, data);
    return;
  }

  // @Patch('/media/:mediaId')
  // @HttpCode(200)
  // @Auth('admin', 'owner')
  // async uploadMedia(
  //   @Param('mediaId') mediaId: string,
  //   @Body() data: { [key in MEDIA_NAMES]: string },
  // ): Promise<void> {
  //   return await this.goodsService.uploadMedia(mediaId, data);
  // }

  // @Delete(':id')
  // @HttpCode(204)
  // @Auth('admin', 'owner')
  // async deleteGood(@Param('id') id: string): Promise<void> {
  //   await this.goodsService.deleteGood(id);
  //   return;
  // }
}
