import { BaseRepository } from '@/database/base-repository';
import { Injectable } from '@nestjs/common';
import { Good } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsRepository extends BaseRepository<'products', Good> {
  constructor() {
    super({ table: 'products' });
  }

  async get(
    args: Prisma.productsFindUniqueArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<Good | null> {
    return super.get(args, options);
  }

  async getMany(
    args?: Prisma.productsFindManyArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<Good[]> {
    return super.getMany(args, options);
  }

  async create(
    args: Prisma.productsCreateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<Good> {
    return super.create(args, options);
  }

  async update(
    args: Prisma.productsUpdateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<Good> {
    return super.update(args, options);
  }

  async delete(
    args: Prisma.productsDeleteArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<void> {
    return super.delete(args, options);
  }
}
