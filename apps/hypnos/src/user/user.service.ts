import { PrismaService } from '@lib/common';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(id: string) {
    return await this.prisma.users.findUnique({ where: { id } });
  }
}
