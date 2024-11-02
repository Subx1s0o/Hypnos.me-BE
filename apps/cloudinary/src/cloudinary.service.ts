import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  getHello(data: string): string {
    console.log('hello from microservice 3');
    return `Hello ${data}`;
  }
}
