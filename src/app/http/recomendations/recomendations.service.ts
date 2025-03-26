import { PrismaService } from '@/libs/common';
import { CategoriesType, Good } from '@/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecomendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserRecomendations(
    page: number,
    limit: number,
    userId?: string,
    viewedProducts?: Partial<Good[]>,
  ) {
    let categories: CategoriesType[] = [];

    if (userId) {
      const userWithViewedProducts = await this.prisma.users.findUnique({
        where: { id: userId },
        include: { viewedProducts: { include: { product: true } } },
      });

      if (!userWithViewedProducts) return [];

      categories = userWithViewedProducts.viewedProducts.map(
        (vp) => vp.product.category,
      );
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

    return await this.prisma.products.findMany({
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
