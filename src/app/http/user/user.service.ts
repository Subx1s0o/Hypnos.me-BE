import { PrismaService } from '@lib/common';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getFavorites(userId: string) {
    const favorites = await this.prisma.favorites.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!favorites || !favorites.items.length) {
      return [];
    }

    return favorites.items.map((item) => ({
      productId: item.productId,
      productTitle: item.product.title,
      productSlug: item.product.slug,
      productPrice: item.product.price,
      productPhoto: item.product.media.main.url,
    }));
  }

  async createFavorite(userId: string, productId: string) {
    //Перевірити айді на валідність
    const existingFavoriteItem = await this.prisma.favoritesItem.findFirst({
      where: {
        favorites: {
          userId,
        },
        productId,
      },
    });

    if (existingFavoriteItem) {
      throw new Error('Product is already in favorites');
    }

    const favorites = await this.prisma.favorites.upsert({
      where: { userId },
      create: {
        userId,
        items: {
          create: [{ productId }],
        },
      },
      update: {
        items: {
          create: [{ productId }],
        },
      },
      include: {
        items: true,
      },
    });

    return favorites;
  }

  async deleteFavorite(userId: string, productId: string) {
    const favoriteItem = await this.prisma.favoritesItem.findFirst({
      where: {
        favorites: {
          userId,
        },
        productId,
      },
    });

    if (!favoriteItem) {
      throw new Error('Product is not in favorites');
    }

    await this.prisma.favoritesItem.delete({
      where: { id: favoriteItem.id },
    });

    return { message: 'Favorite successfully deleted' };
  }
}
