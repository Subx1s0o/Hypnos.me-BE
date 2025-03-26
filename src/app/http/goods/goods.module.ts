import { CacheModule, ConfigService } from '@/libs/common';
import { Module } from '@nestjs/common/decorators/modules';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

@Module({
  imports: [
    CacheModule,
    ClientsModule.registerAsync([
      {
        name: 'CLOUDINARY_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('AMQP_URL')],
            queue: 'cloudinary_queue',
            queueOptions: {
              durable: true,
              autoDelete: false,
            },
            prefetchCount: 1,
            persistent: true,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'VIEWED_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('AMQP_URL')],
            queue: 'viewed_queue',
            queueOptions: {
              durable: true,
              autoDelete: false,
            },
            prefetchCount: 1,
            persistent: true,
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
