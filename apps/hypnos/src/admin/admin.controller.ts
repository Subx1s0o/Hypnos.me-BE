import {
  Body,
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

import { AdminService } from './admin.service';

import { Roles } from '@lib/entities/decorators/Roles';
import { RolesEnum } from '@lib/entities/enum/roles';
import { AuthGuard } from '@lib/entities/guards/auth.guard';
import { RolesGuard } from '@lib/entities/guards/roles.guard';

@Controller('admin')
@ApiTags('admin')
@Roles(RolesEnum.OWNER, RolesEnum.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAdmins(): Promise<Omit<User, 'password'>[]> {
    return await this.adminService.getAdmins();
  }

  @Post()
  async addAdmin(@Body() data: CreateAdminDto) {
    return await this.adminService.addAdmin(data);
  }

  @Delete(':id')
  async deleteAdmin(@Query('id') id: string) {
    return await this.adminService.deleteAdmin(id);
  }
}
