import { CacheService, PrismaService } from '@lib/common';

export class GoodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}
}
