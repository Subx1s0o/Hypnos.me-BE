import { PrismaService } from '@lib/common';
import { MEDIA_STATUS } from '@lib/entities/constans';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { ClientProxy } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { Queue } from 'bull';
import { lastValueFrom } from 'rxjs';
import { CategoriesType, Good } from 'types';
import { CreateGoodDto } from './dto';
import { UpdateGoodDto } from './dto/update';

@Injectable()
export class GoodsService {
  constructor(
    @Inject('CLOUDINARY_SERVICE')
    private readonly cloudinaryClient: ClientProxy,
    private readonly prisma: PrismaService,
    @InjectQueue('image-upload') private imageUploadQueue: Queue,
  ) {}

  async getAllGoods({
    page,
    limit,
    category,
  }: {
    page: string;
    limit: string;
    category?: CategoriesType;
  }): Promise<Good[]> {
    const skip = (+page - 1) * +limit;
    return await this.prisma.products.findMany({
      skip,
      take: +limit,
      where: category ? { category } : undefined,
      orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createGood(data: CreateGoodDto): Promise<Good> {
    const good = await this.prisma.products.create({
      data: {
        title: data.title,
        media: {
          main: { url: '', status: MEDIA_STATUS.pending },
          media_1: { url: '', status: MEDIA_STATUS.pending },
          media_2: { url: '', status: MEDIA_STATUS.pending },
          media_3: { url: '', status: MEDIA_STATUS.pending },
          media_4: { url: '', status: MEDIA_STATUS.pending },
        },
        category: data.category,
        quantity: data.quantity,
        price: data.price,
        isPriceForPair: data.isPriceForPair,
        description: data.description,
        width: data.width,
        thickness: data.thickness,
        weight: data.weight,
        pairWeight: data.pairWeight,
        goldSamples: data.goldSamples.map((sample) => ({
          sampleValue: sample.sampleValue,
          weightMale: sample.weightMale,
          weightFemale: sample.weightFemale,
        })),
      },
    });

    await this.imageUploadQueue.add({
      id: good.id,
      media: data.media,
    });

    return good;
  }

  async updateGood(id: string, data: UpdateGoodDto): Promise<Good> {
    const good = await this.prisma.products.findUnique({ where: { id } });

    if (!good) {
      throw new NotFoundException("The good with current ID wasn't found");
    }

    const updateFields: Prisma.productsUpdateInput = {};

    if (data.media) {
      const updatedMedia = await lastValueFrom(
        this.cloudinaryClient.send('upload_or_add_images', {
          id,
          media: data.media,
        }),
      );
      console.log(updatedMedia);
      updateFields.media = {
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
    }

    if (Object.keys(updateFields).length > 0) {
      console.log(updateFields);
      const updatedProduct = await this.prisma.products.update({
        where: { id },
        data: updateFields,
      });

      if (!updatedProduct) {
        throw new InternalServerErrorException(
          'Prisma Error while updating good',
        );
      }

      return updatedProduct;
    } else {
      throw new HttpException(
        'Nothing changed in this good',
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async deleteGood(id: string): Promise<void> {
    this.cloudinaryClient.send('delete_all_images', id);
    await this.prisma.products.delete({ where: { id } });
  }
}
