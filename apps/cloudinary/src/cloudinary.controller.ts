import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Media } from '@prisma/client';
import { CloudinaryService } from './cloudinary.service';

@Controller()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @MessagePattern('upload_images')
  upload(@Payload() data: Media) {
    return this.cloudinaryService.uploadImages(data);
  }
}
