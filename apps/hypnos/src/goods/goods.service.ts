import { PrismaService } from '@lib/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GoodsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CLOUDINARY_SERVICE')
    private readonly cloudinaryClient: ClientProxy,
  ) {}

  // async createGood(data: CreateGoodDto) {
  //   const createdGood = await this.prisma.products.create({ data: data });

  //   const uploadResponse = await this.cloudinaryClient.send('upload_images', {
  //     productId: createdGood.id,
  //     media: data.media,
  //   });

  //   return createdGood;
  // }
  async sayHello(data: string) {
    return this.cloudinaryClient.send('say_hello', data);
  }
}
