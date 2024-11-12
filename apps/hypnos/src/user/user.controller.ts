import { Auth } from '@lib/entities';
import { Controller, Get, Req } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  async getMe(@Req() req: Request & { user: string }) {
    return await this.userService.getMe(req.user);
  }
}
