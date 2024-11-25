import {  Controller, } from '@nestjs/common/decorators';

import { Promocode } from "types"
import {  CreatePromocodeDto } from './dto/create.dto';
import { PromocodesService } from './promocodes.service';
import { MessagePattern } from '@nestjs/microservices';



@Controller()
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @MessagePattern("create-promocode")
  async create(createPromoCodeDto: CreatePromocodeDto): Promise<void> {
    return await this.promocodesService.create(createPromoCodeDto);
  }

  @MessagePattern("all-promocodes")
  async findAll(): Promise<Promocode[]> {
    return await this.promocodesService.findAll();
  }

  @MessagePattern("delete-promocode")
  async remove(id: string): Promise<void> {
    return await this.promocodesService.remove(id);
  }

  @MessagePattern("apply-promocode")
  async apply(code: string): Promise<void> {
    return await this.promocodesService.applyPromoCode(code);
  }
}
