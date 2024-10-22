import { PrismaService } from '@lib/common';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { TokensResponse } from 'types';
import { v4 as uuid } from 'uuid';
import { SignInDto } from './dtos/signIn.dto';
import { SignUpDto } from './dtos/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  private generateTokens(id: string): TokensResponse {
    const accessToken = this.jwtService.sign({ id }, { expiresIn: '30m' });
    const refreshToken = this.jwtService.sign({ id }, { expiresIn: '5d' });

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

  private async getReferrerId(referralCode?: string): Promise<string | null> {
    if (!referralCode) return null;

    const referrer = await this.prismaService.user.findUnique({
      where: { referredCode: referralCode },
    });
    return referrer ? referrer.id : null;
  }

  async signUp(data: SignUpDto) {
    const isUserExists = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (isUserExists) {
      throw new ConflictException(
        'The User is Already Been Registered, Please Sign-In',
      );
    }

    const hashedPassword = await hash(data.password, 8);

    const referralCodeGenerated = uuid()
      .replace(/-/g, '')
      .slice(0, 7)
      .toUpperCase();

    const newUser = {
      ...data,
      password: hashedPassword,
      referredCode: referralCodeGenerated,
      referredBy: await this.getReferrerId(data.referredCode),
    };

    const storedUser = await this.prismaService.user.create({
      data: {
        ...newUser,
        bonusesHistory: [],
        ordersHistory: [],
        cart: [],
      },
    });

    if (storedUser.referredBy) {
      await this.prismaService.user.update({
        where: { id: storedUser.referredBy },
        data: {
          bonuses: { increment: 20 },
        },
      });
      await this.prismaService.user.update({
        where: { id: storedUser.id },
        data: {
          bonuses: { increment: 20 },
        },
      });
    }

    return this.generateTokens(storedUser.id);
  }

  async signIn(data: SignInDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new BadRequestException(
        "The Email or Password is Wrong, or User doesn't Exist",
      );
    }

    const verifiedPassword = await compare(data.password, user.password);

    if (!verifiedPassword) {
      throw new UnauthorizedException(
        "The Email or Password is Wrong, or User doesn't Exist",
      );
    }

    return this.generateTokens(user.id);
  }

  async refresh(refreshToken: string) {
    const verified = this.jwtService.verify(refreshToken);

    if (!verified) {
      throw new UnauthorizedException(
        'The Token is Wrong or Expired, Please Sign-In',
      );
    }

    return this.generateTokens(verified.sub);
  }
}
