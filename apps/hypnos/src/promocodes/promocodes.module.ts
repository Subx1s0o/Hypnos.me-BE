import { Module } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@lib/common';

@Module({
  imports: [ClientsModule.registerAsync([
    {
      name: 'PROMOCODES_SERVICE',
      useFactory: async (config: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [config.get('AMQP_URL')],
          queue: 'promocodes_queue',
        },
      }),
      inject: [ConfigService],
    },
  ]),],
  controllers: [PromocodesController],
  providers: [PromocodesService],
})
export class PromocodesModule {}
