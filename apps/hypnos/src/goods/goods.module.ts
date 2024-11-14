import { CacheModule } from '@lib/common';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common/decorators/modules';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { GoodsProcessor } from './helpers/goods.processor';

@Module({
  imports: [
    CacheModule,
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.get<string>('REDIS_STORE'),
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'image-upload',
    }),
    ClientsModule.registerAsync([
      {
        name: 'CLOUDINARY_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('AMQP_URL')],
            queue: 'cloudinary_queue',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [GoodsService, GoodsProcessor],
  controllers: [GoodsController],
})
export class GoodsModule {}
