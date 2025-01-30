import { Module } from '@nestjs/common/decorators/modules';

import { ConfigService } from '@lib/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PAYMENTS_SERVICE',
        useFactory: async (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get('AMQP_URL')],
            queue: 'payments_queue',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
