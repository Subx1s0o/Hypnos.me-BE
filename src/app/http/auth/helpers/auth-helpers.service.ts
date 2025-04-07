import { PrismaService } from '@/libs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/types';
import { TokensResponse } from '../types/tokens-response.type';

@Injectable()
export class AuthHelpersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  generateTokens(user: User): TokensResponse {
    const accessToken = this.jwtService.sign(
      { id: user.id, role: user.role },
      { expiresIn: '30m' },
    );
    const refreshToken = this.jwtService.sign(
      { id: user.id, role: user.role },
      { expiresIn: '5d' },
    );
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(
        new Date().setMinutes(new Date().getMinutes() + 30),
      ),
      refreshTokenValidUntil: new Date(
        new Date().setDate(new Date().getDate() + 5),
      ),
    };
  }

  async getReferrerId(referralCode?: string): Promise<string | null> {
    if (!referralCode) return null;

    const referrer = await this.prismaService.users.findUnique({
      where: { referredCode: referralCode },
    });
    return referrer ? referrer.id : null;
  }
}
