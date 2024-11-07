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
import { Queue } from 'bull';
import { lastValueFrom } from 'rxjs';
import { CategoriesType, Good } from 'types';
import { CreateGoodDto, UpdateOrAddDto } from './dto';
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
      throw new NotFoundException("The good with current ID was'nt found");
    }

    const allowedUpdateFields = [
      'title',
      'category',
      'price',
      'description',
      'width',
      'thickness',
      'quantity',
      'weight',
      'pairWeight',
      'goldSamples',
    ];

    const updateFields: any = {};

    Object.entries(data).forEach(([key, value]) => {
      if (allowedUpdateFields.includes(key) && good[key] !== value) {
        updateFields[key] = value;
      }
    });

    if (Object.keys(updateFields).length > 0) {
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

  async changeOrAddImage(data: {
    id: string;
    data: UpdateOrAddDto;
  }): Promise<void> {
    console.log(data);
    console.log(this.cloudinaryClient);
    const res = await lastValueFrom(
      this.cloudinaryClient.send('upload_or_add_images', data),
    );

    console.log(res);

    if (res.status === MEDIA_STATUS.rejected) {
      throw new InternalServerErrorException(
        'Error while updating or adding image',
      );
    }

    const mediaName = res.name;

    await this.prisma.products.update({
      where: { id: data.id },
      data: {
        media: {
          update: {
            [mediaName]: {
              url: res.url,
              status: res.status,
            },
          },
        },
      },
    });

    throw new HttpException(
      'The product was successfully updated',
      HttpStatus.OK,
    );
  }
}
