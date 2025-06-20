import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'types';
import { TokensResponse } from '../types/tokens-response.type';
import { UserRepository } from '@/database/repositories/user.repository';
import { config } from '@/core/config';

@Injectable()
export class AuthHelpersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  generateTokens(user: User): TokensResponse {
    const accessToken = this.jwtService.sign(
      { id: user.id, role: user.role },
      {
        expiresIn: '30m',
        privateKey: config.jwt.privateKey,
        algorithm: config.jwt.algorithm,
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: user.id, role: user.role },
      {
        expiresIn: '5d',
        privateKey: config.jwt.privateKey,
        algorithm: config.jwt.algorithm,
      },
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

    const referrer = await this.userRepository.get({
      where: { referredCode: referralCode },
    });
    return referrer ? referrer.id : null;
  }
}
