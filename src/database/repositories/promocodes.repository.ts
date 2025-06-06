import { BaseRepository } from '@/database/base-repository';
import { Injectable } from '@nestjs/common';
import { Promocode } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromocodesRepository extends BaseRepository<
  'promocodes',
  Promocode
> {
  constructor() {
    super({ table: 'promocodes' });
  }

  async get(
    args: Prisma.promocodesFindUniqueArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<Promocode | null> {
    return super.get(args, options);
  }

  async getMany(
    args?: Prisma.promocodesFindManyArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<Promocode[]> {
    return super.getMany(args, options);
  }

  async create(
    args: Prisma.promocodesCreateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<Promocode> {
    return super.create(args, options);
  }

  async update(
    args: Prisma.promocodesUpdateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<Promocode> {
    return super.update(args, options);
  }

  async delete(
    args: Prisma.promocodesDeleteArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<void> {
    return super.delete(args, options);
  }
}
