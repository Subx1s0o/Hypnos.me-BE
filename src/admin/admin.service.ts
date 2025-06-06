import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'types';

import { CreateAdminDto } from './dtos/create.dto';
import { UserRepository } from '@/database/repositories/user.repository';

@Injectable()
export class AdminService {
  constructor(private readonly userRepository: UserRepository) {}

  async changeRole(data: CreateAdminDto) {
    const user = await this.userRepository.get({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `The user with id ${data.userId} wasn't found`,
      );
    }

    const updatedUser = await this.userRepository.update({
      where: { id: user.id },
      data: { role: data.role },
      omit: {
        password: true,
      },
    });

    return updatedUser;
  }

  async getAdmins(): Promise<Omit<User, 'password'>[]> {
    const admins = await this.userRepository.getMany({
      where: { role: 'admin' },
      omit: {
        password: true,
      },
    });

    return admins;
  }

  async deleteAdmin(id: string) {
    return await this.userRepository.delete({ where: { id } });
  }
}
