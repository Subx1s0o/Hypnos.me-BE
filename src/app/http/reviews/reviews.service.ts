import { PrismaService, CacheService } from '@/libs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async createReview(slug: string, data: ReviewDto) {
    const product = await this.prisma.products.findUnique({
      where: { slug },
      include: { reviews: true },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    await this.prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          ...data,
          productId: product.id,
        },
      });

      const allReviews = [...product.reviews, newReview];

      const totalRating = allReviews.reduce(
        (sum, review) => sum + review.rate,
        0,
      );
      const averageRating = totalRating / allReviews.length;

      const roundedRating = Math.round(averageRating * 2) / 2;

      const finalRating = Number.isInteger(roundedRating)
        ? roundedRating
        : Math.floor(roundedRating * 2) / 2;

      const updatedProduct = await tx.products.update({
        where: { slug },
        data: {
          rating: finalRating,
        },
      });

      await this.cache.set(`/goods/${slug}`, updatedProduct);
    });
  }

  async getReviews(slug: string, page: number, limit: number) {
    const product = await this.prisma.products.findUnique({
      where: { slug },
    });
    const reviews = await this.prisma.review.findMany({
      where: { productId: product.id },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalReviews = await this.prisma.review.count({
      where: { productId: product.id },
    });

    return {
      data: reviews,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      page,
      limit,
    };
  }
}
