import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException } from '@/core/exceptions/app.exception';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { AuthResponse } from './types/auth-response.type';

import { v4 as uuid } from 'uuid';
import { SignInDto, SignUpDto } from './dtos';
import { AuthHelpersService } from './helpers/auth-helpers.service';
import { TokensResponse } from './types/tokens-response.type';
import { exclude } from 'utils';
import { UserRepository } from '@/database/repositories/user.repository';
import { config } from '@/core/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly authHelpers: AuthHelpersService,
    private readonly mailer: MailerService,
  ) {}

  async signUp(data: SignUpDto): Promise<AuthResponse> {
    const isUserExists = await this.userRepository.get({
      where: { email: data.email },
    });

    if (isUserExists) {
      throw new AppException(
        'The User is Already Been Registered, Please Sign-In',
        HttpStatus.CONFLICT,
        {
          className: this.constructor.name,
          methodName: this.signUp.name,
          body: data,
        },
      );
    }

    const hashedPassword = await hash(data.password, 10);
    const referralCodeGenerated = uuid()
      .replace(/-/g, ' ')
      .slice(0, 7)
      .toUpperCase();

    const newUser = await this.userRepository.create({
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

    // if (newUser.referredBy) {
    //   await this.referralQueue.add('processReferral', { user: newUser });
    // }

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
    const user = await this.userRepository.get({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppException(
        "The Email or Password is Wrong, or User doesn't Exist",
        HttpStatus.BAD_REQUEST,
        {
          className: this.constructor.name,
          methodName: this.signIn.name,
          body: data,
        },
      );
    }

    const verifiedPassword = await compare(data.password, user.password);

    if (!verifiedPassword) {
      throw new AppException(
        "The Email or Password is Wrong, or User doesn't Exist",
        HttpStatus.UNAUTHORIZED,
        {
          className: this.constructor.name,
          methodName: this.signIn.name,
          body: data,
        },
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
      const verified = this.jwtService.verify(refreshToken, {
        publicKey: config.jwt.publicKey,
        algorithms: [config.jwt.algorithm],
      });
      return this.authHelpers.generateTokens(verified.sub);
    } catch (error) {
      throw new AppException(
        '[JWT_EXPIRED]- The Token is Invalid or Expired, Please Sign-In',
        HttpStatus.UNAUTHORIZED,
        {
          className: this.constructor.name,
          methodName: this.refresh.name,
        },
      );
    }
  }

  async changePassword(
    oldPasssword: string,
    newPassword: string,
    userID: string,
  ) {
    const user = await this.userRepository.get({
      where: { id: userID },
    });

    if (!user) {
      throw new AppException('User does not exist', HttpStatus.BAD_REQUEST, {
        className: this.constructor.name,
        methodName: this.changePassword.name,
      });
    }

    if (oldPasssword === newPassword) {
      throw new AppException(
        'The new password must be different from the old password',
        HttpStatus.BAD_REQUEST,
        {
          className: this.constructor.name,
          methodName: this.changePassword.name,
        },
      );
    }

    const verifiedPassword = await compare(oldPasssword, user.password);

    if (!verifiedPassword) {
      throw new AppException(
        "The old password doesn't match with real password",
        HttpStatus.FORBIDDEN,
        {
          className: this.constructor.name,
          methodName: this.changePassword.name,
        },
      );
    }
    const hashedPassword = await hash(newPassword, 10);

    try {
      await this.userRepository.update({
        where: { id: userID },
        data: {
          password: hashedPassword,
        },
      });
    } catch {
      throw new AppException(
        'Error while changing the password, please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          className: this.constructor.name,
          methodName: this.changePassword.name,
        },
      );
    }

    throw new AppException(
      'The password is successfully changed',
      HttpStatus.OK,
      {
        className: this.constructor.name,
        methodName: this.changePassword.name,
      },
    );
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.get({
      where: { email },
    });

    if (!user) {
      throw new AppException(
        "The user wasn't found, Please Sign-Up",
        HttpStatus.BAD_REQUEST,
        {
          className: this.constructor.name,
          methodName: this.forgotPassword.name,
          body: { email },
        },
      );
    }

    const token = this.jwtService.sign(
      { id: user.id },
      {
        expiresIn: '20m',
        privateKey: config.jwt.privateKey,
        algorithm: config.jwt.algorithm,
      },
    );

    try {
      await this.mailer.sendMail({
        from: config.mailer.username,
        to: email,
        text: token,
      });
    } catch {
      throw new AppException(
        `Error while sending email to ${email}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          className: this.constructor.name,
          methodName: this.forgotPassword.name,
          body: { email },
        },
      );
    }

    throw new AppException(
      `The email was successfully sended to ${email}`,
      HttpStatus.OK,
      {
        className: this.constructor.name,
        methodName: this.forgotPassword.name,
        body: { email },
      },
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const verified = this.jwtService.verify(token, {
      publicKey: config.jwt.publicKey,
      algorithms: [config.jwt.algorithm],
    });

    if (!verified) {
      throw new AppException(
        'The Token is Invalid or Expired',
        HttpStatus.BAD_REQUEST,
        {
          className: this.constructor.name,
          methodName: this.resetPassword.name,
        },
      );
    }

    const user = await this.userRepository.get({
      where: { id: verified.id },
    });

    if (!user) {
      throw new AppException(
        "The User Wasn't Found, try Sign-Up first",
        HttpStatus.NOT_FOUND,
        {
          className: this.constructor.name,
          methodName: this.resetPassword.name,
        },
      );
    }

    const hashPassword = await hash(newPassword, 10);

    try {
      await this.userRepository.update({
        where: { id: verified.id },
        data: {
          password: hashPassword,
        },
      });
    } catch {
      throw new AppException(
        'Error while updating User',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          className: this.constructor.name,
          methodName: this.resetPassword.name,
        },
      );
    }

    throw new AppException(
      'The password was successfully reset',
      HttpStatus.OK,
      {
        className: this.constructor.name,
        methodName: this.resetPassword.name,
      },
    );
  }
}
