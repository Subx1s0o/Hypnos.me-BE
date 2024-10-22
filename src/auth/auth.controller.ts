import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TokensResponse } from 'types';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { RefreshTokenDto } from './dtos/refreshToken.dto';
import { SignInDto } from './dtos/signIn.dto';
import { SignUpDto } from './dtos/signUp.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() data: SignUpDto): Promise<TokensResponse> {
    return await this.authService.signUp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() data: SignInDto): Promise<TokensResponse> {
    return await this.authService.signIn(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() data: RefreshTokenDto): Promise<TokensResponse> {
    return await this.authService.refresh(data.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() data: ChangePasswordDto,
    @Req() req: Request & { user: string },
  ): Promise<any> {
    const userID = req.user; // Отримуємо ID користувача

    if (!userID) {
      throw new BadRequestException('User ID is required'); // Переконайтеся, що ID не undefined
    }
    return await this.authService.changePassword(
      data.oldPassword,
      data.newPassword,
      userID,
    );
  }
}
