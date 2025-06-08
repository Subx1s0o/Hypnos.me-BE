import { BaseRepository } from '@/database/repositories/base-repository';
import { Injectable } from '@nestjs/common';
import { User } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository extends BaseRepository<'users', User> {
  constructor() {
    super({ table: 'users' });
  }

  async get(
    args: Prisma.usersFindUniqueArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<User | null> {
    return super.get(args, options);
  }

  async getMany(
    args?: Prisma.usersFindManyArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<User[]> {
    return super.getMany(args, options);
  }

  async create(
    args: Prisma.usersCreateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<User> {
    return super.create(args, options);
  }

  async update(
    args: Prisma.usersUpdateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<User> {
    return super.update(args, options);
  }

  async delete(
    args: Prisma.usersDeleteArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<void> {
    return super.delete(args, options);
  }
}
