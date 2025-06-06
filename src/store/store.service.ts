import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class StoreService {
  constructor() {}

  // async uploadImages(_data: MediaData) {
  //   return;
  // }

  // async uploadOrUpdateImages({
  //   mediaId,
  //   media,
  // }: {
  //   mediaId: string;
  //   media: {
  //     main?: string;
  //     media_1?: string;
  //     media_2?: string;
  //     media_3?: string;
  //     media_4?: string;
  //   };
  // }) {
  //   const folderPath = `products/${mediaId}`;
  //   const updatedMedia = {};

  //   for (const [field, image] of Object.entries(media)) {
  //     if (image) {
  //       try {
  //         await this.cloudinaryClient.api.resource(`${folderPath}/${field}`, {
  //           type: 'upload',
  //         });

  //         const result = await this.cloudinaryClient.uploader.upload(image, {
  //           folder: folderPath,
  //           public_id: field,
  //           overwrite: true,
  //           transformation: [{ quality: 'auto', fetch_format: 'avif' }],
  //         });

  //         updatedMedia[field] = {
  //           url: result.secure_url,
  //           name: field,
  //           status: MEDIA_STATUS.fulfilled,
  //         };
  //       } catch (error) {
  //         if (error.error?.http_code === 404) {
  //           const result = await this.cloudinaryClient.uploader.upload(image, {
  //             folder: folderPath,
  //             public_id: field,
  //             transformation: [{ quality: 'auto', fetch_format: 'avif' }],
  //           });

  //           updatedMedia[field] = {
  //             url: result.secure_url,
  //             name: field,
  //             status: MEDIA_STATUS.fulfilled,
  //           };
  //         } else {
  //           updatedMedia[field] = {
  //             url: '',
  //             status: MEDIA_STATUS.rejected,
  //           };
  //         }
  //       }
  //     } else {
  //       updatedMedia[field] = {
  //         url: '',
  //         status: MEDIA_STATUS.not_uploaded,
  //       };
  //     }
  //   }

  //   return updatedMedia;
  // }

  // async deleteAllPhotos(id: string) {
  //   await this.cloudinaryClient.api.delete_resources([id]);
  // }

  // async deleteFilesFromFolder(folderName: string) {
  //   try {
  //     const result = await this.cloudinaryClient.api.resources({
  //       type: 'upload',
  //       prefix: folderName,
  //       max_results: 500,
  //     });

  //     const deletePromises = result.resources.map(async (file) => {
  //       return await this.cloudinaryClient.uploader.destroy(file.public_id);
  //     });

  //     await Promise.all(deletePromises);

  //     await this.cloudinaryClient.api.delete_folder(folderName);
  //   } catch (error) {}
  // }

  // async clearAllFolders() {
  //   const folders = ['products'];
  //   for (const folder of folders) {
  //     await this.deleteFilesFromFolder(folder);
  //   }
  // }
}
