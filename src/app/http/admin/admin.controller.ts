import { Auth } from 'src/libs/entities/decorators';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/types';
import { CreateAdminDto } from './dtos/create.dto';

import { AdminService } from './admin.service';

@Controller('admin')
@Auth('owner')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Auth('owner')
  @Get()
  async getAdmins(): Promise<Omit<User, 'password'>[]> {
    return await this.adminService.getAdmins();
  }

  @Auth('owner')
  @Post()
  async changeRole(@Body() data: CreateAdminDto) {
    return await this.adminService.changeRole(data);
  }

  @Auth('owner')
  @Delete(':id')
  async deleteAdmin(@Query('id') id: string) {
    return await this.adminService.deleteAdmin(id);
  }
}
