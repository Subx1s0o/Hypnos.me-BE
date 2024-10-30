import { Body, Controller, Post } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CreateSessionDto } from './dto/create-session.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-session')
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    return this.paymentsService.createCheckoutSession(
      createSessionDto.products,
    );
  }

  @Post('webhook')
  async webhook(@Body() event: Stripe.Event) {
    return this.paymentsService.handleWebhook(event);
  }
}
