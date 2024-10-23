import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('hello')
  async getHello() {
    return 'Okay hello';
  }
}
