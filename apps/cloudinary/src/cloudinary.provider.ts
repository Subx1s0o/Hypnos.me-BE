import { ConfigService } from '@lib/common/config/config.service';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get('CLD_CLOUD_NAME'),
      api_key: configService.get('CLD_API_KEY'),
      api_secret: configService.get('CLD_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
