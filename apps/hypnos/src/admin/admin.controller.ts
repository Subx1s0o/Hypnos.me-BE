import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'types';
import { CreateAdminDto } from './dtos/create.dto';

import { AdminService } from './admin.service';

import { Auth } from '@lib/entities/decorators/Auth';

@Controller('admin')
@ApiTags('admin')
@Auth('owner')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAdmins(): Promise<Omit<User, 'password'>[]> {
    return await this.adminService.getAdmins();
  }

  @Post()
  async changeRole(@Body() data: CreateAdminDto) {
    return await this.adminService.changeRole(data);
  }

  @Delete(':id')
  async deleteAdmin(@Query('id') id: string) {
    return await this.adminService.deleteAdmin(id);
  }
}
