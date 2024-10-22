import { ConfigService, PrismaService } from '@lib/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { TokensResponse } from 'types';
import { v4 as uuid } from 'uuid';
import { SignInDto, SignUpDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
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

    const referrer = await this.prismaService.users.findUnique({
      where: { referredCode: referralCode },
    });
    return referrer ? referrer.id : null;
  }

  async signUp(data: SignUpDto) {
    const isUserExists = await this.prismaService.users.findUnique({
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

    const storedUser = await this.prismaService.users.create({
      data: {
        ...newUser,
        bonusesHistory: [],
        ordersHistory: [],
        cart: [],
      },
    });

    if (storedUser.referredBy) {
      await this.prismaService.users.update({
        where: { id: storedUser.referredBy },
        data: {
          bonuses: { increment: 20 },
        },
      });
      await this.prismaService.users.update({
        where: { id: storedUser.id },
        data: {
          bonuses: { increment: 20 },
        },
      });
    }

    return this.generateTokens(storedUser.id);
  }

  async signIn(data: SignInDto) {
    const user = await this.prismaService.users.findUnique({
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
        'The Token is Invalid or Expired, Please Sign-In',
      );
    }

    return this.generateTokens(verified.sub);
  }

  async changePassword(
    oldPasssword: string,
    newPassword: string,
    userID: string,
  ) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userID },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    if (oldPasssword === newPassword) {
      throw new BadRequestException(
        'The new password must be different from the old password',
      );
    }

    const verifiedPassword = await compare(oldPasssword, user.password);

    if (!verifiedPassword) {
      throw new ForbiddenException(
        "The old password doesn't match with real password",
      );
    }
    const hashedPassword = await hash(newPassword, 8);

    try {
      await this.prismaService.users.update({
        where: { id: userID },
        data: {
          password: hashedPassword,
        },
      });
    } catch {
      throw new InternalServerErrorException(
        'Error while changing the password, please try again later',
      );
    }

    throw new HttpException(
      'The password is successfully changed',
      HttpStatus.OK,
    );
  }

  async forgotPassword(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("The user wasn't found, Please Sign-Up");
    }

    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '20m' });

    try {
      await this.mailer.sendMail({
        from: this.config.get('MAILER_FROM') as string,
        to: email,
        text: token,
      });
    } catch {
      throw new InternalServerErrorException(
        `Error while sending email to ${email}`,
      );
    }

    throw new HttpException(
      `The email was successfully sended to ${email}`,
      HttpStatus.OK,
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const verified = this.jwtService.verify(token);

    if (!verified) {
      throw new BadRequestException('The Token is Invalid or Expired');
    }

    const user = await this.prismaService.users.findUnique({
      where: { id: verified.id },
    });

    if (!user) {
      throw new NotFoundException("The User Wasn't Found, try Sign-Up first");
    }

    const hashPassword = await hash(newPassword, 8);

    try {
      await this.prismaService.users.update({
        where: { id: verified.id },
        data: {
          password: hashPassword,
        },
      });
    } catch {
      throw new InternalServerErrorException('Error while updating User');
    }

    throw new HttpException(
      'The password was successfully reset',
      HttpStatus.OK,
    );
  }
}
