import { BaseRepository } from '@/database/repositories/base-repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export type ViewedProduct = {
  id: string;
  userId: string;
  productId: string;
  date: Date;
};

@Injectable()
export class ViewedProductsRepository extends BaseRepository<
  'viewedProducts',
  ViewedProduct
> {
  constructor() {
    super({ table: 'viewedProducts' });
  }

  async get(
    args: Prisma.viewedProductsFindUniqueArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<ViewedProduct | null> {
    return super.get(args, options);
  }

  async getMany(
    args?: Prisma.viewedProductsFindManyArgs,
    options: { useCache?: boolean; ttl?: number; usePrimary?: boolean } = {},
  ): Promise<ViewedProduct[]> {
    return super.getMany(args, options);
  }

  async create(
    args: Prisma.viewedProductsCreateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<ViewedProduct> {
    return super.create(args, options);
  }

  async update(
    args: Prisma.viewedProductsUpdateArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<ViewedProduct> {
    return super.update(args, options);
  }

  async delete(
    args: Prisma.viewedProductsDeleteArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<void> {
    return super.delete(args, options);
  }

  async deleteMany(
    args: Prisma.viewedProductsDeleteManyArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<void> {
    const model = this.getPrimaryModel();
    await model.deleteMany(args);

    if (options.invalidateCache !== false) {
      await this.clearCache();
    }
  }

  async upsert(
    args: Prisma.viewedProductsUpsertArgs,
    options: { invalidateCache?: boolean } = {},
  ): Promise<ViewedProduct> {
    return super.upsert(args, options);
  }
}
