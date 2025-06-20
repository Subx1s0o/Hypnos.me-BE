import { CategoriesType } from 'types';
import { Injectable, Inject } from '@nestjs/common';
import { ProductsRepository } from '@/database/repositories/products.repository';
import { ViewedProductsRepository } from '@/database/repositories/viewed-products.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RecomendationsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly viewedProductsRepository: ViewedProductsRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getUserRecomendations(page: number, limit: number, userId?: string) {
    if (!userId) {
      const popularCacheKey = `popular:${page}:${limit}`;

      const cached = await this.cacheManager.get(popularCacheKey);
      if (cached) {
        return cached;
      }

      const popularProducts = await this.productsRepository.getMany({
        orderBy: [{ views: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          discountPercent: true,
          isPriceForPair: true,
          category: true,
          rating: true,
          media: { select: { main: true } },
        },
      } as any);

      await this.cacheManager.set(popularCacheKey, popularProducts, 600000);

      return popularProducts;
    }

    const cacheKey = `recommendations:${userId}:${page}:${limit}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    let categories: CategoriesType[] = [];
    let excludeProductIds: string[] = [];

    const userViewedProducts = await this.viewedProductsRepository.getMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 50,
      include: {
        product: {
          select: {
            id: true,
            category: true,
          },
        },
      },
    } as any);

    if (userViewedProducts.length === 0) {
      const popularProducts = await this.productsRepository.getMany({
        orderBy: [{ views: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          discountPercent: true,
          isPriceForPair: true,
          category: true,
          rating: true,
          media: { select: { main: true } },
        },
      } as any);

      await this.cacheManager.set(cacheKey, popularProducts, 300000);

      return popularProducts;
    }

    categories = userViewedProducts.map((vp: any) => vp.product.category);
    excludeProductIds = userViewedProducts.map((vp: any) => vp.product.id);

    if (categories.length === 0) {
      return [];
    }

    const categoryCount = new Map<CategoriesType, number>();
    categories.forEach((category) => {
      categoryCount.set(
        category as CategoriesType,
        (categoryCount.get(category as CategoriesType) || 0) + 1,
      );
    });

    const top3Categories: CategoriesType[] = Array.from(categoryCount.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([category]) => category);

    const recommendations = await this.productsRepository.getMany({
      where: {
        category: { in: top3Categories },
        id:
          excludeProductIds.length > 0
            ? { notIn: excludeProductIds }
            : undefined,
      },
      orderBy: [{ views: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        discountPercent: true,
        isPriceForPair: true,
        category: true,
        rating: true,
        media: { select: { main: true } },
      },
    } as any);

    await this.cacheManager.set(cacheKey, recommendations, 300000);

    return recommendations;
  }
}
