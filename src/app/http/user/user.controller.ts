import { Auth } from '@/libs/entities';
import { Controller, Get, Req } from '@nestjs/common/decorators';

import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get()
  async getUser(@Req() req: Request & { user: { id: string } }) {
    return await this.userService.getUser(req.user.id);
  }
}
