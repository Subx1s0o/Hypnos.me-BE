import { MEDIA_STATUS } from '@lib/entities/constans';
import { Inject, Injectable } from '@nestjs/common';
import { MediaData } from './dto/media.dto';

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

  async uploadOrUpdateImages({
    id,
    media,
  }: {
    id: string;
    media: {
      main?: string;
      media_1?: string;
      media_2?: string;
      media_3?: string;
      media_4?: string;
    };
  }) {
    const folderPath = `products/${id}`;
    const updatedMedia = {};

    for (const [field, image] of Object.entries(media)) {
      if (image) {
        try {
          const resource = await this.cloudinaryClient.api.resource(
            `${folderPath}/${field}`,
            { type: 'upload' },
          );

          console.log('Ресурс знайдено, оновлюємо:', resource);

          const result = await this.cloudinaryClient.uploader.upload(image, {
            folder: folderPath,
            public_id: field,
            overwrite: true,
            transformation: [{ quality: 'auto', fetch_format: 'avif' }],
          });

          console.log('Ресурс успішно оновлено:', result);
          updatedMedia[field] = {
            url: result.secure_url,
            name: field,
            status: MEDIA_STATUS.fulfilled,
          };
        } catch (error) {
          if (error.error?.http_code === 404) {
            console.log('Ресурс не знайдено, завантажуємо новий.');

            const result = await this.cloudinaryClient.uploader.upload(image, {
              folder: folderPath,
              public_id: field,
              transformation: [{ quality: 'auto', fetch_format: 'avif' }],
            });

            console.log('Новий ресурс успішно завантажено:', result);
            updatedMedia[field] = {
              url: result.secure_url,
              name: field,
              status: MEDIA_STATUS.fulfilled,
            };
          } else {
            console.error(
              'Помилка під час спроби знайти ресурс:',
              error.error?.message,
            );
            updatedMedia[field] = {
              url: '',
              status: MEDIA_STATUS.rejected,
            };
          }
        }
      } else {
        updatedMedia[field] = {
          url: '',
          status: MEDIA_STATUS.not_uploaded,
        };
      }
    }

    console.log(updatedMedia);
    return updatedMedia;
  }

  async deleteAllPhotos(id: string) {
    await this.cloudinaryClient.api.delete_resources([id]);
  }
}
