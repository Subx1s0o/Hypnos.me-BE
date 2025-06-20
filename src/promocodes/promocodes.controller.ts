import { Controller, Delete, Get, Post } from '@nestjs/common/decorators';

import { Promocode } from 'types';

import { PromocodesService } from './promocodes.service';
import { CreatePromocodeDto } from './dto/create.dto';

@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Post()
  async create(createPromoCodeDto: CreatePromocodeDto): Promise<void> {
    return await this.promocodesService.createPromocode(createPromoCodeDto);
  }

  @Get()
  async findAll(): Promise<Promocode[]> {
    return await this.promocodesService.findAll();
  }

  @Delete()
  async remove(id: string): Promise<void> {
    return await this.promocodesService.remove(id);
  }

  @Post('apply')
  async apply(code: string): Promise<void> {
    return await this.promocodesService.applyPromoCode(code);
  }
}
