import { Inject, Injectable } from '@nestjs/common';
import { MediaData } from '../types/media.type';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('Cloudinary') private readonly cloudinaryClient) {}

  async uploadImages(data: MediaData) {
    const folderPath = `products/${data.id}`;

    const uploadPromises = Object.entries(data.media).map(
      async ([key, file]) => {
        if (file) {
          try {
            const result = await this.cloudinaryClient.uploader.upload(file, {
              folder: folderPath,
              public_id: key,
              transformation: [{ quality: 'auto', fetch_format: 'avif' }],
            });
            return { url: result.secure_url, status: 'fulfilled' };
          } catch (error) {
            console.error('Error uploading image:', error);
            return { url: '', status: 'rejected' };
          }
        }
        return { url: '', status: 'not_uploaded' };
      },
    );

    const results = await Promise.all(uploadPromises);

    return {
      main: results[0] || { url: '', status: 'not_uploaded' },
      media_1: results[1] || { url: '', status: 'not_uploaded' },
      media_2: results[2] || { url: '', status: 'not_uploaded' },
      media_3: results[3] || { url: '', status: 'not_uploaded' },
      media_4: results[4] || { url: '', status: 'not_uploaded' },
    };
  }
}
