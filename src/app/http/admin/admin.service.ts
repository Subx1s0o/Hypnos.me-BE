import { CacheService, PrismaService } from '@/libs/common';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/types';

import { CreateAdminDto } from './dtos/create.dto';
import { exclude } from 'src/utils/exclude';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async changeRole(data: CreateAdminDto): Promise<Omit<User, 'password'>> {
    const cacheKey = `user:${data.userId}`;
    let user = await this.cache.get<User>(cacheKey);

    if (!user) {
      user = await this.prisma.users.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `The user with id ${data.userId} wasn't found`,
        );
      }
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: user.id },
      data: { role: data.role },
    });

    await this.cache.set(cacheKey, updatedUser, 300);

    return exclude(updatedUser, ['password']);
  }

  async getAdmins(): Promise<Omit<User, 'password'>[]> {
    const admins = await this.prisma.users.findMany({
      omit: {
        password: true,
      },
      where: { role: 'admin' },
    });

    return admins;
  }

  async deleteAdmin(id: string) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`The user with id ${id} does not exist`);
    }

    await this.prisma.users.delete({ where: { id } });
    await this.cache.del(`user:${user.id}`);

    throw new HttpException(
      'The user role was successfully deleted',
      HttpStatus.OK,
    );
  }
}
