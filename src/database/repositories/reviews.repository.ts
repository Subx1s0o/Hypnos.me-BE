import { BaseRepository } from '@/database/repositories/base-repository';
import { Injectable } from '@nestjs/common';
import { Review } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsRepository extends BaseRepository<'review', Review> {
  constructor() {
    super({ table: 'review' });
  }

  async get(
    args: Prisma.reviewFindUniqueArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<Review | null> {
    return super.get(args, options);
  }

  async getMany(
    args?: Prisma.reviewFindManyArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<Review[]> {
    return super.getMany(args, options);
  }

  async create(
    args: Prisma.reviewCreateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<Review> {
    return super.create(args, options);
  }

  async update(
    args: Prisma.reviewUpdateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<Review> {
    return super.update(args, options);
  }

  async delete(
    args: Prisma.reviewDeleteArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<void> {
    return super.delete(args, options);
  }
}
