import { Inject, Injectable } from '@nestjs/common';
import { Media } from '@prisma/client';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('Cloudinary') private readonly cloudinaryClient) {}

  async uploadImages(data: Media) {
    const uploadPromises = Object.values(data).map(async (file) => {
      if (file) {
        try {
          const result = await this.cloudinaryClient.uploader.upload(file, {
            transformation: [{ quality: 'auto', fetch_format: 'avif' }],
          });
          return result.secure_url;
        } catch (error) {
          console.error('Error uploading image:', error);
          return '';
        }
      }
      return '';
    });

    const results = await Promise.all(uploadPromises);

    return {
      main: results[0] || '',
      media_1: results[1] || '',
      media_2: results[2] || '',
      media_3: results[3] || '',
      media_4: results[4] || '',
    };
  }
}
