import { PrismaService } from '@lib/common';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'types';
import { CreateAdminDto } from './dtos/create.dto';

@Injectable()
export class OwnerService {
  constructor(private readonly prisma: PrismaService) {}

  async addAdmin(data: CreateAdminDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException(
        `The user with email ${data.email} wasn't found`,
      );
    }

    return await this.prisma.users.update({
      where: { id: user.id },
      data: { role: 'admin' },
    });
  }

  async getAdmins(): Promise<User[]> {
    return (await this.prisma.users.findMany({
      where: { role: 'admin' },
    })) as unknown as User[];
  }

  async deleteAdmin(id: string) {
    const user = await this.prisma.users.delete({ where: { id } });

    if (!user) {
      throw new NotFoundException(`The user with id ${id} not exist`);
    }

    throw new HttpException(
      'The user role was successfully deleted',
      HttpStatus.OK,
    );
  }
}
