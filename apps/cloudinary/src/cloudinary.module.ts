import { ConfigModule, ConfigService } from '@lib/common';
import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  controllers: [CloudinaryController],
  providers: [
    CloudinaryService,
    {
      provide: 'Cloudinary',
      useFactory: (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get('CLD_CLOUD_NAME'),
          api_key: configService.get('CLD_API_KEY'),
          api_secret: configService.get('CLD_API_SECRET'),
        });

        return cloudinary;
      },
      inject: [ConfigService],
    },
  ],
})
export class CloudinaryModule {}
