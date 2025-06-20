import { Auth } from '@/core/decorators/Auth';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreateAdminDto } from './dtos/create.dto';

import { AdminService } from './admin.service';

@Controller('admin')
@Auth('owner')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAdmins() {
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
