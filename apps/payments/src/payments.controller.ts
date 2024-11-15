import { CreateSessionDto } from '@lib/entities/global.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create-session')
  async createSession(data: CreateSessionDto) {
    return await this.paymentsService.createCheckoutSession(data);
  }

  @Post('webhook')
  @MessagePattern('webhook')
  async webhook(@Body() event: Stripe.Event) {
    return this.paymentsService.handleWebhook(event);
  }
}
