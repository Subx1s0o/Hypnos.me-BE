import { PrismaService } from '@lib/common';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdmins() {
    return await this.prisma.users.findMany({ where: { role: 'admin' } });
  }

  async changeUserRole(id: string, role: 'admin' | 'user') {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`The user with id ${id} wasn't found`);
    }

    await this.prisma.users.update({ where: { id }, data: { role: role } });

    throw new HttpException(
      'The user role was successfully updated',
      HttpStatus.OK,
    );
  }
}
