import { PrismaService } from '@lib/common';
import { InjectQueue } from '@nestjs/bull';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CATEGORIES } from '@lib/entities';
import { Queue } from 'bull';
import { lastValueFrom } from 'rxjs';
import { CreateGoodDto } from './dto/create.dto';
import { UpdateOrAddDto } from './dto/update.dto';

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
    page: number;
    limit: number;
    category?: CATEGORIES;
  }) {
    const skip = (page - 1) * limit;
    return await this.prisma.products.findMany({
      skip,
      take: limit,
      where: category ? { category } : undefined,
      orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createGood(data: CreateGoodDto) {
    const good = await this.prisma.products.create({
      data: {
        title: data.title,
        media: {
          main: { url: '', status: 'pending' },
          media_1: { url: '', status: 'pending' },
          media_2: { url: '', status: 'pending' },
          media_3: { url: '', status: 'pending' },
          media_4: { url: '', status: 'pending' },
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

  async changeOrAddImage(data: { id: string; data: UpdateOrAddDto }) {
    console.log(data);
    console.log(this.cloudinaryClient);
    const res = await lastValueFrom(
      this.cloudinaryClient.send('upload_or_add_images', data),
    );

    console.log(res);

    if (res.status === 'rejected') {
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
