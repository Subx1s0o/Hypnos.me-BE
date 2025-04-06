import { CacheService, PrismaService } from '@/libs/common';
import { Inject, Injectable } from '@nestjs/common/decorators';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CategoriesType, Good, GoodPreview } from 'src/types';
import { CreateGoodDto } from './dto';
import { UpdateGoodDto } from './dto/update';
import { v4 } from 'uuid';
import { MEDIA_NAMES } from '@/libs/entities';
import { Media, Prisma } from '@prisma/client';
import { ProductCatalogQueryDto } from './dto/product-catalog-query.dto';

@Injectable()
export class GoodsService {
  constructor(
    @Inject('CLOUDINARY_SERVICE')
    private readonly cloudinaryClient: ClientProxy,
    private readonly cache: CacheService,
    private readonly prisma: PrismaService,
  ) {}

  async getAllGoods({
    page,
    limit,
    category,
    search,
  }: {
    page: string;
    limit: string;
    category?: CategoriesType;
    search: string;
  }): Promise<{ data: GoodPreview[]; totalPages: number; count: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber <= 0 ||
      limitNumber <= 0
    ) {
      throw new BadRequestException('Invalid page or limit');
    }

    const skip = (pageNumber - 1) * limitNumber;

    const totalItems = await this.prisma.products.count({
      where: category ? { category } : {},
    });

    const totalPages = Math.ceil(totalItems / limitNumber);

    const products = await this.prisma.products.findMany({
      skip,
      take: limitNumber,
      where: {
        category: category ? category : undefined,
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
      select: {
        category: true,
        discountPercent: true,
        media: { select: { main: true } },
        id: true,
        price: true,
        isPriceForPair: true,
        slug: true,
        title: true,
      },
    });

    return {
      data: products,
      totalPages,
      count: totalItems,
    };
  }

  async getCatalog(
    queries: ProductCatalogQueryDto,
  ): Promise<{ data: GoodPreview[]; totalPages: number; count: number }> {
    function getOrderBy(order: ProductCatalogQueryDto['order']) {
      switch (order) {
        case 'asc-price':
          return { price: 'asc' as Prisma.SortOrder };
        case 'desc-price':
          return { price: 'desc' as Prisma.SortOrder };
        case 'popularity':
          return { rating: 'desc' as Prisma.SortOrder };
        case 'newest':
          return { createdAt: 'desc' as Prisma.SortOrder };
        case 'most-viewed':
          return { views: 'desc' as Prisma.SortOrder };
        default:
          return undefined;
      }
    }
    let orderBy: { [key: string]: Prisma.SortOrder } | undefined;
    if (queries.order) orderBy = getOrderBy(queries.order);
    const aggregate = await this.prisma.products.findMany({
      where: {
        category: queries.category ? queries.category : undefined,
        title: queries.search
          ? { contains: queries.search, mode: 'insensitive' }
          : undefined,
        price: {
          gte: queries.minPrice ? queries.minPrice : 0,
          lte: queries.maxPrice ? queries.maxPrice : Number.MAX_SAFE_INTEGER,
        },
      },
      take: queries.limit,
      skip: (queries.page - 1) * queries.limit,
      orderBy: orderBy ? orderBy : undefined,
      select: {
        category: true,
        discountPercent: true,
        media: { select: { main: true } },
        id: true,
        price: true,
        isPriceForPair: true,
        slug: true,
        rating: true,
        views: true,
        createdAt: true,
        title: true,
      },
    });

    const count = await this.prisma.products.count({
      where: {
        category: queries.category,
        title: queries.search
          ? { contains: queries.search, mode: 'insensitive' }
          : undefined,
        price: {
          gte: queries.minPrice,
          lte: queries.maxPrice,
        },
      },
    });

    const totalPages = Math.ceil(count / queries.limit);

    return {
      data: aggregate,
      totalPages,
      count,
    };
  }

  async getGood(slug: string): Promise<Good> {
    const product = await this.cache.get<Good>(`/goods/${slug}`);

    if (product) {
      return product;
    } else {
      const data = await this.prisma.products.findUnique({
        where: { slug },
      });

      if (!data) {
        throw new NotFoundException("The good with that slug wasn't found");
      }

      await this.cache.set(`/goods/${slug}`, data);
      return data;
    }
  }

  async createGood(data: CreateGoodDto): Promise<Good> {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    const uniqueId = v4().replace(/-/g, '').slice(0, 7).toLowerCase();
    const readySlug = `${slug}-${uniqueId}`;
    const mediaId = v4().replace(/-/g, '').slice(0, 15).toLowerCase();

    const createdMedia = await lastValueFrom(
      this.cloudinaryClient.send('upload_images', {
        media: data.media,
        id: mediaId,
      }),
    );

    if (!createdMedia) {
      throw new InternalServerErrorException(
        'Something went wrong while uploading media',
      );
    }

    const good = await this.prisma.products.create({
      data: {
        ...data,
        mediaId: mediaId,
        slug: readySlug,
        media: createdMedia,
        ringDetails: data.ringDetails.map((ring) => ({
          purityValue: ring.purityValue,
          maleWeight: ring.maleWeight,
          femaleWeight: ring.femaleWeight,
        })),
        diamondDetails: data.diamondDetails,
      },
    });

    return good;
  }

  async updateGood(id: string, data: UpdateGoodDto): Promise<void> {
    let good: Good;
    try {
      good = await this.prisma.products.findUnique({ where: { id } });
    } catch {
      throw new BadRequestException(
        'Prisma Error while getting good, invalid Id',
      );
    }

    if (!good) {
      throw new NotFoundException("The good with current ID wasn't found");
    }

    const updatedProduct = await this.prisma.products.update({
      where: { id },
      data,
    });

    const cachedGood = await this.cache.get<Good>(`/goods/${good.slug}`);

    if (cachedGood) {
      await this.cache.set(`/goods/${good.slug}`, {
        ...cachedGood,
        ...data,
      });
    }

    if (!updatedProduct) {
      throw new InternalServerErrorException(
        'Prisma Error while updating good',
      );
    }
  }

  async uploadMedia(
    mediaId: string,
    media: { [key in MEDIA_NAMES]: string },
  ): Promise<any> {
    try {
      const updatedMedia = await lastValueFrom(
        this.cloudinaryClient.send('upload_or_add_images', { mediaId, media }),
      );

      const formattedMedia: Media = {
        main: {
          url: updatedMedia.main?.url || '',
          status: updatedMedia.main?.url ? 'fulfilled' : 'not_uploaded',
        },
        media_1: {
          url: updatedMedia.media_1?.url || '',
          status: updatedMedia.media_1?.url ? 'fulfilled' : 'not_uploaded',
        },
        media_2: {
          url: updatedMedia.media_2?.url || '',
          status: updatedMedia.media_2?.url ? 'fulfilled' : 'not_uploaded',
        },
        media_3: {
          url: updatedMedia.media_3?.url || '',
          status: updatedMedia.media_3?.url ? 'fulfilled' : 'not_uploaded',
        },
        media_4: {
          url: updatedMedia.media_4?.url || '',
          status: updatedMedia.media_4?.url ? 'fulfilled' : 'not_uploaded',
        },
      };

      const product = await this.prisma.products.update({
        where: { mediaId: mediaId },
        data: { media: formattedMedia },
      });

      const cachedGood = await this.cache.get<Good>(`/goods/${product.slug}`);

      if (cachedGood) {
        await this.cache.set(`/goods/${product.slug}`, {
          ...cachedGood,
          media: formattedMedia,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload images to Cloudinary',
      );
    }
  }

  async deleteGood(id: string): Promise<void> {
    this.cloudinaryClient.send('delete_all_images', id);
    const deletedGood = await this.prisma.products.delete({ where: { id } });

    if (!deletedGood) {
      throw new BadRequestException('Prisma Error while deleting good');
    }

    await this.cache.del(`/goods/${deletedGood.slug}`);
  }

  async getViewedGoods(userId: string): Promise<Good[]> {
    const userWithViewedProducts = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        viewedProducts: {
          orderBy: { date: 'desc' },
          include: { product: true },
        },
      },
    });

    if (!userWithViewedProducts) return [];

    return userWithViewedProducts.viewedProducts.map((vp) => vp.product);
  }
}
