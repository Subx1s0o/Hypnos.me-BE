import { PrismaService } from '@/libs/common';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { UpdateUserDto } from './dto/update';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId: string, body: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: { id: userId },
      data: body,
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
        id: true,
        role: true,
      },
    });
    return user;
  }
}
