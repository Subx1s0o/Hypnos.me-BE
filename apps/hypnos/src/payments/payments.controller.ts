import { CreateSessionDto } from '@lib/entities/global.dto';
import { Body, Controller, Inject, Post } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject('PAYMENTS_SERVICE')
    private readonly paymentsService: ClientProxy,
  ) {}

  @Post()
  async createSession(@Body() data: CreateSessionDto): Promise<void> {
    const res = await lastValueFrom(
      this.paymentsService.send('create-session', data),
    );

    return res;
  }

  @Post('webhook')
  async webhook(): Promise<void> {
    const res = await lastValueFrom(this.paymentsService.send('webhook', data));

    return res;
  }
}
