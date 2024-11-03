import { PrismaService } from '@lib/common';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateGoodDto } from './dto/create.dto';

@Injectable()
export class GoodsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('image-upload') private imageUploadQueue: Queue,
  ) {}

  async getAllGoods() {
    return await this.prisma.products.findMany();
  }

  async createGood(data: CreateGoodDto) {
    const good = await this.prisma.products.create({
      data: {
        title: data.title,
        media: {
          main: '',
          media_1: '',
          media_2: '',
          media_3: '',
          media_4: '',
        },
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
}
