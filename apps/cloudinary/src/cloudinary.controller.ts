import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MediaData } from '../types/media.type';
import { CloudinaryService } from './cloudinary.service';

@Controller()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @MessagePattern('upload_images')
  upload(@Payload() data: MediaData) {
    return this.cloudinaryService.uploadImages(data);
  }
}
