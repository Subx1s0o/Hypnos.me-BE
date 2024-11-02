import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CLOUDINARY_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('AMQP_URL') as string],
            queue: 'cloudinary_queue',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [GoodsService],
  controllers: [GoodsController],
})
export class GoodsModule {}
