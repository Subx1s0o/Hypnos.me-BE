import { CategoriesType, Good } from 'types';
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '@/database/repositories/products.repository';
import { ViewedProductsRepository } from '@/database/repositories/viewed-products.repository';

@Injectable()
export class RecomendationsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly viewedProductsRepository: ViewedProductsRepository,
  ) {}

  async getUserRecomendations(
    page: number,
    limit: number,
    userId?: string,
    viewedProducts?: Partial<Good[]>,
  ) {
    let categories: CategoriesType[] = [];

    if (userId) {
      // Get user's viewed products
      const userViewedProducts = await this.viewedProductsRepository.getMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 50, // Limit to recent viewed products
      });

      if (userViewedProducts.length === 0) return [];

      // Get the actual products to extract categories
      const productIds = userViewedProducts.map((vp) => vp.productId);
      const products = await this.productsRepository.getMany({
        where: { id: { in: productIds } },
      });

      categories = products.map((product) => product.category);
    } else if (viewedProducts) {
      categories = viewedProducts.map((vp) => vp.category);
    }

    if (categories.length === 0) return [];

    const popularCategories = categories.reduce<Record<CategoriesType, number>>(
      (acc, category) => {
        acc[category as CategoriesType] =
          (acc[category as CategoriesType] || 0) + 1;
        return acc;
      },
      {} as Record<CategoriesType, number>,
    );

    const top3Categories: CategoriesType[] = Object.entries(popularCategories)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([category]) => category as CategoriesType);

    return await this.productsRepository.getMany({
      where: {
        category: { in: top3Categories },
        id: { notIn: viewedProducts?.map((vp) => vp.id) },
      },
      orderBy: [{ views: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      skip: (page - 1) * limit,
    });
  }
}
