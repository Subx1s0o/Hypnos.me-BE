import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TokensResponse } from 'types';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from './dtos';

@Controller('auth')
@ApiTags('auth')
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
    const userID = req.user;

    if (!userID) {
      throw new BadRequestException('User ID is required');
    }

    return await this.authService.changePassword(
      data.oldPassword,
      data.newPassword,
      userID,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    return await this.authService.resetPassword(
      token,
      resetPasswordDto.newPassword,
    );
  }
}
