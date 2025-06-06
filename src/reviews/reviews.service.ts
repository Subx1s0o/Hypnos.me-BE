import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewDto } from './dto/review.dto';
import { ReviewsRepository } from '../database/repositories/reviews.repository';
import { ProductsRepository } from '../database/repositories/products.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async createReview(slug: string, data: ReviewDto) {
    const product = await this.productsRepository.get({
      where: { slug },
      include: { reviews: true },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    await this.reviewsRepository.transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          ...data,
          productId: product.id,
        },
      });

      const existingReviews = await this.reviewsRepository.getMany({
        where: { productId: product.id },
      });
      const allReviews = [...existingReviews, newReview];

      const totalRating = allReviews.reduce(
        (sum, review) => sum + review.rate,
        0,
      );
      const averageRating = totalRating / allReviews.length;

      const roundedRating = Math.round(averageRating * 2) / 2;

      const finalRating = Number.isInteger(roundedRating)
        ? roundedRating
        : Math.floor(roundedRating * 2) / 2;

      return await tx.products.update({
        where: { slug },
        data: {
          rating: finalRating,
        },
      });
    });
  }

  async getReviews(slug: string, page: number, limit: number) {
    const product = await this.productsRepository.get({
      where: { slug },
    });
    const reviews = await this.reviewsRepository.getMany({
      where: { productId: product.id },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalReviews = await this.reviewsRepository.count({
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
