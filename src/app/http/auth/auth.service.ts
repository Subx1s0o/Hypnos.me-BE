import { ConfigService, PrismaService } from '@/libs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
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
import { Queue } from 'bull';
import { AuthResponse } from './types/auth-response.type';

import { v4 as uuid } from 'uuid';
import { SignInDto, SignUpDto } from './dtos';
import { AuthHelpersService } from './helpers/auth-helpers.service';
import { TokensResponse } from './types/tokens-response.type';
import { exclude } from '@/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
    @InjectQueue('referral-queue') private referralQueue: Queue,
    private readonly authHelpers: AuthHelpersService,
  ) {}

  async signUp(data: SignUpDto): Promise<AuthResponse> {
    const isUserExists = await this.prismaService.users.findUnique({
      where: { email: data.email },
    });

    if (isUserExists) {
      throw new ConflictException(
        'The User is Already Been Registered, Please Sign-In',
      );
    }

    const hashedPassword = await hash(data.password, 10);
    const referralCodeGenerated = uuid()
      .replace(/-/g, ' ')
      .slice(0, 7)
      .toUpperCase();

    const newUser = await this.prismaService.users.create({
      data: {
        firstName: data.firstName,
        secondName: data.secondName,
        email: data.email,
        password: hashedPassword,
        referredCode: referralCodeGenerated,
        referredBy: await this.authHelpers.getReferrerId(data.referredCode),
        bonusesHistory: [],
      },
    });

    if (newUser.referredBy) {
      await this.referralQueue.add('processReferral', { user: newUser });
    }

    const tokens = this.authHelpers.generateTokens(newUser);
    const userWithoutPassword = exclude(newUser, ['password']);

    return {
      user: {
        ...userWithoutPassword,
      },
      ...tokens,
    };
  }

  async signIn(data: SignInDto): Promise<AuthResponse> {
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

    const tokens = this.authHelpers.generateTokens(user);
    const userWithoutPassword = exclude(user, ['password']);

    return {
      user: {
        ...userWithoutPassword,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<TokensResponse> {
    try {
      const verified = this.jwtService.verify(refreshToken);
      return this.authHelpers.generateTokens(verified.sub);
    } catch (error) {
      throw new UnauthorizedException(
        '[JWT_EXPIRED]- The Token is Invalid or Expired, Please Sign-In',
      );
    }
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
    const hashedPassword = await hash(newPassword, 10);

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

    const hashPassword = await hash(newPassword, 10);

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
