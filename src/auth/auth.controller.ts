import { Auth } from '@/core/decorators/Auth';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AppException } from '@/core/exceptions/app.exception';

import { Request } from 'express';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dtos';
import { AuthResponse } from './types/auth-response.type';
import { TokensResponse } from './types/tokens-response.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() data: SignUpDto): Promise<AuthResponse> {
    return await this.authService.signUp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() data: SignInDto): Promise<AuthResponse> {
    return await this.authService.signIn(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() data: RefreshTokenDto): Promise<TokensResponse> {
    return await this.authService.refresh(data.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @Auth()
  async changePassword(
    @Body() data: ChangePasswordDto,
    @Req() req: Request & { user: { id: string } },
  ): Promise<void> {
    const userID = req.user.id;

    if (!userID) {
      throw new AppException('User ID is required', HttpStatus.BAD_REQUEST, {
        className: this.constructor.name,
        methodName: this.changePassword.name,
      });
    }

    return await this.authService.changePassword(
      data.oldPassword,
      data.newPassword,
      userID,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    if (!token) {
      throw new AppException('Token is required', HttpStatus.BAD_REQUEST, {
        className: this.constructor.name,
        methodName: this.resetPassword.name,
      });
    }

    return await this.authService.resetPassword(
      token,
      resetPasswordDto.newPassword,
    );
  }
}
