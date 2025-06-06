import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
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

    if (!user) throw new NotFoundException('User not found');

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
