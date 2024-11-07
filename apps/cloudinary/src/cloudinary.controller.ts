import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CloudinaryService } from './cloudinary.service';
import { MediaData } from './dto/media.dto';

@Controller()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @MessagePattern('upload_images')
  async upload(@Payload() data: MediaData) {
    return await this.cloudinaryService.uploadImages(data);
  }

  @MessagePattern('upload_or_add_images')
  async uploadOrAdd(@Payload() data) {
    console.log(data);
    return await this.cloudinaryService.uploadOrUpdateImage(data);
  }

  @MessagePattern('delete_all_images')
  async deleteImages(@Payload() id: string): Promise<void> {
    return await this.cloudinaryService.deleteAllPhotos(id);
  }
}
