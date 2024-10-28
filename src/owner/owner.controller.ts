import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'types';
import { CreateAdminDto } from './dtos/create.dto';
import { OwnerGuard } from './owner.guard';
import { OwnerService } from './owner.service';

@UseGuards(OwnerGuard)
@Controller('owner')
@ApiTags('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get()
  async getAdmins(): Promise<User[]> {
    return await this.ownerService.getAdmins();
  }

  @Post()
  async addAdmin(data: CreateAdminDto) {
    return await this.ownerService.addAdmin(data);
  }

  @Delete(':id')
  async deleteAdmin(@Query('id') id: string) {
    return await this.ownerService.deleteAdmin(id);
  }
}
