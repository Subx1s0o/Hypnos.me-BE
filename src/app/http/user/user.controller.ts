import { Auth } from '@/libs/entities';
import { Controller, Get, Put, Req, Body } from '@nestjs/common/decorators';

import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get()
  async getUser(@Req() req: Request & { user: { id: string } }) {
    return await this.userService.getUser(req.user.id);
  }

  @Auth()
  @Put('')
  async updateUser(
    @Req() req: Request & { user: { id: string } },
    @Body() body: UpdateUserDto,
  ) {
    return await this.userService.updateUser(req.user.id, body);
  }
}
