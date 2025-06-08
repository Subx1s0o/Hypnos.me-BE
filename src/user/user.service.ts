import { Injectable } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common';
import { AppException } from '@/core/exceptions/app.exception';
import { UpdateUserDto } from './dto/update';
import { UserRepository } from '../database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(userId: string) {
    const user = await this.userRepository.get({
      where: { id: userId },
      omit: {
        password: true,
      },
    });

    if (!user)
      throw new AppException('User not found', HttpStatus.NOT_FOUND, {
        className: this.constructor.name,
        methodName: this.getUser.name,
      });

    return user;
  }

  async updateUser(userId: string, body: UpdateUserDto) {
    const user = await this.userRepository.update({
      where: { id: userId },
      data: body,
      omit: {
        password: true,
      },
    });
    return user;
  }
}
