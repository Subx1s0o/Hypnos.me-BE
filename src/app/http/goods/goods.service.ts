import { PrismaService } from '@/libs/common';
import { Inject, Injectable } from '@nestjs/common/decorators';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CategoriesType, Good, GoodPreview } from 'src/types';
import { CreateGoodDto, SearchDto } from './dto';
import { UpdateGoodDto } from './dto/update';
import { v4 } from 'uuid';
import { Request } from 'express';
import { MEDIA_NAMES } from '@/libs/entities';
import { Media } from '@prisma/client';
@Injectable()
export class GoodsService {
  constructor(
    @Inject('CLOUDINARY_SERVICE')
    private readonly cloudinaryClient: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  async getAllGoods({
    page,
    limit,
    category,
  }: {
    page: string;
    limit: string;
    category?: CategoriesType;
  }): Promise<{ data: GoodPreview[]; totalPages: number }> {
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
      where: category ? { category } : {},
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
    };
  }

  async getGood(slug: string, _req: Request): Promise<Good> {
    const data = await this.prisma.products.findUnique({ where: { slug } });

    if (!data) {
      throw new NotFoundException("The good with that slug wasn't found");
    }

    // await this.viewedProductQueue.add({
    //   request: req,
    //   product: {
    //     slug: data.slug,
    //     title: data.title,
    //     category: data.category,
    //     discountPercent: data.discountPercent,
    //     media: data.media.main.url,
    //     price: data.price,
    //     isPriceForPair: data.isPriceForPair,
    //   },
    // });

    return data;
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
    const good = await this.prisma.products.findUnique({ where: { id } });

    if (!good) {
      throw new NotFoundException("The good with current ID wasn't found");
    }

    const updatedProduct = await this.prisma.products.update({
      where: { id },
      data,
    });

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

      console.log(formattedMedia);

      await this.prisma.products.update({
        where: { mediaId: mediaId },
        data: { media: formattedMedia },
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);

      throw new InternalServerErrorException(
        'Failed to upload images to Cloudinary',
      );
    }
  }

  async deleteGood(id: string): Promise<void> {
    this.cloudinaryClient.send('delete_all_images', id);
    await this.prisma.products.delete({ where: { id } });
  }

  async search(data: SearchDto) {
    const products = await this.prisma.products.findMany({
      where: {
        title: { contains: data.title, mode: 'insensitive' },
      },
    });

    return products;
  }
}
