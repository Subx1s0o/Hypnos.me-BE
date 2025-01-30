import { Auth } from '@lib/entities';
import { Body, Controller, Get, Post, Req } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('favorites')
  @Auth()
  async getFavorits(@Req() req: Request & { user: string }) {
    return await this.userService.getFavorites(req.user);
  }

  @Auth()
  @Post('favorites')
  async addTofavorites(@Body() data, @Req() req: Request & { user: string }) {
    return await this.userService.createFavorite(req.user, data.productId);
  }
}
