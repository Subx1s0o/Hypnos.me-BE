import { Module } from '@nestjs/common/decorators/modules';
import Stripe from 'stripe';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { config } from '@/core/config';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        const apiKey =
          config.stripe_secret_key || 'sk_test_dummy_key_for_development';
        return new Stripe(apiKey);
      },
    },
    PaymentsService,
  ],
})
export class PaymentsModule {}
