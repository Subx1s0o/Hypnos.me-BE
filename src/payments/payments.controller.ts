import { CreateSessionDto } from '@/core/global.dto';
import { Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-session')
  async createSession(data: CreateSessionDto) {
    return await this.paymentsService.createCheckoutSession(data);
  }

  // @Post('webhook')
  // @MessagePattern('webhook')
  // async webhook(@Body() event: Stripe.Event) {
  //   return this.paymentsService.handleWebhook(event);
  // }
}
