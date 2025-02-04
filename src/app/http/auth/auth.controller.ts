import { Auth } from 'src/libs/entities/decorators/Auth';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({
    status: 201,
    description: 'The user has been created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, user already exists or validation errors',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async signUp(@Body() data: SignUpDto): Promise<AuthResponse> {
    return await this.authService.signUp(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiResponse({
    status: 200,
    description: 'The user has been logged successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid credentials',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async signIn(@Body() data: SignInDto): Promise<AuthResponse> {
    return await this.authService.signIn(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiResponse({
    status: 200,
    description: 'The auth were refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, invalid or expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async refresh(@Body() data: RefreshTokenDto): Promise<TokensResponse> {
    return await this.authService.refresh(data.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'The password was changed successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request, user ID is required or password validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is wrong or expired',
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden, old password doesn't match",
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async changePassword(
    @Body() data: ChangePasswordDto,
    @Req() req: Request & { user: string },
  ): Promise<void> {
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
  @ApiResponse({
    status: 200,
    description: 'The email was successfully sent for password recovery',
  })
  @ApiResponse({
    status: 400,
    description: "Bad request, the user wasn't found",
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiResponse({
    status: 200,
    description: 'The password was successfully reset',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid token or password validation errors',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, please try again later',
  })
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    return await this.authService.resetPassword(
      token,
      resetPasswordDto.newPassword,
    );
  }
}
