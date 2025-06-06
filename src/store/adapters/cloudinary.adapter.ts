import { v2 as clry, ConfigOptions } from 'cloudinary';
import { config } from '@/core/config';
import { registerAs } from '@nestjs/config';
import { StoreAdapterBase } from '../store.interface';
import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_STATUS } from '@/core/constans';

registerAs('cloudinary', (): typeof clry => {
  clry.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  } as ConfigOptions);
  return clry;
});

@Injectable()
export class CloudinaryAdapter implements StoreAdapterBase {
  constructor(
    @Inject('cloudinary')
    private readonly cloudinary: typeof clry,
  ) {}

  async uploadMany(files: File[]) {
    const mediaData = {
      mediaId: Date.now().toString(),
      media: {
        main: files[0],
        media_1: files[1],
        media_2: files[2],
        media_3: files[3],
        media_4: files[4],
      },
    };

    const folderPath = `products/${mediaData.mediaId}`;

    const uploadPromises = Object.entries(mediaData.media).map(
      async ([key, file]) => {
        if (file) {
          try {
            const buffer = await file.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const dataUri = `data:${file.type};base64,${base64}`;

            const result = await this.cloudinary.uploader.upload(dataUri, {
              folder: folderPath,
              public_id: key,
              transformation: [{ quality: 'auto', fetch_format: 'avif' }],
            });
            return {
              url: result.secure_url as string,
              status: MEDIA_STATUS.fulfilled,
            };
          } catch {
            return { url: '', status: MEDIA_STATUS.rejected };
          }
        }
        return { url: '', status: MEDIA_STATUS.not_uploaded };
      },
    );

    const results = await Promise.all(uploadPromises);

    return {
      main: results[0] || { url: '', status: MEDIA_STATUS.not_uploaded },
      media_1: results[1] || { url: '', status: MEDIA_STATUS.not_uploaded },
      media_2: results[2] || { url: '', status: MEDIA_STATUS.not_uploaded },
      media_3: results[3] || { url: '', status: MEDIA_STATUS.not_uploaded },
      media_4: results[4] || { url: '', status: MEDIA_STATUS.not_uploaded },
    };
  }

  async uploadOne(_file: File) {}

  async delete(id: string) {
    return this.cloudinary.uploader.destroy(id);
  }

  async getSecureUrl(id: string) {
    return this.cloudinary.url(id, {
      secure: true,
    });
  }
}
