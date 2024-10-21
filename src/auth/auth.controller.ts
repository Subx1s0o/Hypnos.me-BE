import { Body, Controller, Post } from '@nestjs/common';
import { TokensResponse } from 'types';
import { AuthService } from './auth.service';
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

  @Post('sign-in')
  async signIn(@Body() data: SignInDto): Promise<TokensResponse> {
    return await this.authService.signIn(data);
  }

  @Post('refresh')
  async refresh(@Body() data: RefreshTokenDto): Promise<TokensResponse> {
    return await this.authService.refresh(data.refreshToken);
  }
}
