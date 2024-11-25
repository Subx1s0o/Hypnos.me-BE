import { Inject, Injectable } from '@nestjs/common';
import { CreatePromocodeDto } from './dto/create.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApplyPromocodeDto } from './dto';

@Injectable()
export class PromocodesService {
  constructor(@Inject('PROMOCODES_SERVICE') private readonly client: ClientProxy) {}

 async create(createPromocodeDto: CreatePromocodeDto) {
    return await lastValueFrom(this.client.send("create-promocode", createPromocodeDto))
  }

  async findAll() {
    return await lastValueFrom(this.client.send("all-promocodes", {}))
  }

  async remove(id: string) {
    return await lastValueFrom(this.client.send("delete-promocode", {id}))
  }

  async apply( applyPromocodeDto: ApplyPromocodeDto): Promise<void> {
    return await lastValueFrom(this.client.send("apply-promocode", applyPromocodeDto.code))
  }
}
