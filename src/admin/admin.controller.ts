import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';

@UseGuards(AdminGuard)
@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAdmins() {
    return await this.adminService.getAdmins();
  }

  @Patch(':id')
  async changeUserRole(
    @Query('id') id: string,
    @Body() role: 'admin' | 'user',
  ) {
    return await this.adminService.changeUserRole(id, role);
  }
}
