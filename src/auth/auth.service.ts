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
    };
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

    const hashedPassword = await hash(data.password, 10);

    const newUser = {
      ...data,
      password: hashedPassword,
    };
    const storedUser = await this.prismaService.user.create({
      data: newUser,
    });

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
