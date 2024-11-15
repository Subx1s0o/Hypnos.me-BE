import { ConfigModule, ConfigService, PrismaModule } from '@lib/common';
import { Module } from '@nestjs/common/decorators/modules';
import Stripe from 'stripe';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [PaymentsController],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get('STRIPE_SECRET_KEY'), {
          apiVersion: '2024-09-30.acacia',
        });
      },
      inject: [ConfigService],
    },
    PaymentsService,
  ],
})
export class PaymentsModule {}
