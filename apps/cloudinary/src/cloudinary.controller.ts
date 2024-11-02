import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CloudinaryService } from './cloudinary.service';

@Controller()
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @MessagePattern('say_hello')
  getHello(@Payload() data): string {
    console.log(data);
    return this.cloudinaryService.getHello(data.name);
  }
}
