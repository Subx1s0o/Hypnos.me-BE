import { MEDIA_STATUS } from 'src/libs/entities/constans';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { v2 as Cloudinary } from 'cloudinary';
import { MediaData } from './dto/media.dto';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY_INSTANCE')
    private readonly cloudinaryClient: typeof Cloudinary,
  ) {}

  async uploadImages(data: MediaData) {
    const folderPath = `products/${data.mediaId}`;

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
    mediaId,
    media,
  }: {
    mediaId: string;
    media: {
      main?: string;
      media_1?: string;
      media_2?: string;
      media_3?: string;
      media_4?: string;
    };
  }) {
    const folderPath = `products/${mediaId}`;
    const updatedMedia = {};

    for (const [field, image] of Object.entries(media)) {
      if (image) {
        try {
          await this.cloudinaryClient.api.resource(`${folderPath}/${field}`, {
            type: 'upload',
          });

          const result = await this.cloudinaryClient.uploader.upload(image, {
            folder: folderPath,
            public_id: field,
            overwrite: true,
            transformation: [{ quality: 'auto', fetch_format: 'avif' }],
          });

          updatedMedia[field] = {
            url: result.secure_url,
            name: field,
            status: MEDIA_STATUS.fulfilled,
          };
        } catch (error) {
          if (error.error?.http_code === 404) {
            const result = await this.cloudinaryClient.uploader.upload(image, {
              folder: folderPath,
              public_id: field,
              transformation: [{ quality: 'auto', fetch_format: 'avif' }],
            });

            updatedMedia[field] = {
              url: result.secure_url,
              name: field,
              status: MEDIA_STATUS.fulfilled,
            };
          } else {
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

    return updatedMedia;
  }

  async deleteAllPhotos(id: string) {
    await this.cloudinaryClient.api.delete_resources([id]);
  }

  async deleteFilesFromFolder(folderName: string) {
    try {
      const result = await this.cloudinaryClient.api.resources({
        type: 'upload',
        prefix: folderName,
        max_results: 500,
      });

      const deletePromises = result.resources.map(async (file) => {
        return await this.cloudinaryClient.uploader.destroy(file.public_id);
      });

      await Promise.all(deletePromises);

      await this.cloudinaryClient.api.delete_folder(folderName);
    } catch (error) {}
  }

  async clearAllFolders() {
    const folders = ['products'];
    for (const folder of folders) {
      await this.deleteFilesFromFolder(folder);
    }
  }
}
