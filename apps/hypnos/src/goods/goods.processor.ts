import { PrismaService } from '@lib/common';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bull';
import { lastValueFrom } from 'rxjs';
import { GoodsJobType } from 'types';

@Injectable()
@Processor('image-upload')
export class GoodsProcessor {
  constructor(
    @Inject('CLOUDINARY_SERVICE')
    private readonly cloudinaryClient: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  @Process()
  async handleImageUpload(job: Job<GoodsJobType>) {
    const { id, media } = job.data;
    const photos = await lastValueFrom(
      this.cloudinaryClient.send('upload_images', { id, media }),
    );

    let updatedProduct;
    try {
      updatedProduct = await this.prisma.products.update({
        where: { id },
        data: {
          media: {
            main: photos.main || '',
            media_1: photos.media_1 || '',
            media_2: photos.media_2 || '',
            media_3: photos.media_3 || '',
            media_4: photos.media_4 || '',
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }

    return updatedProduct;
  }
}
