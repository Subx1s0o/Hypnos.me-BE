import { Injectable, HttpStatus } from '@nestjs/common';
import { AppException } from '@/core/exceptions/app.exception';
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
      throw new AppException('Product not found', HttpStatus.BAD_REQUEST, {
        className: this.constructor.name,
        methodName: this.createReview.name,
      });
    }

    const newReview = await this.reviewsRepository.create({
      data: {
        ...data,
        productId: product.id,
      },
    });

    const allReviews = await this.reviewsRepository.getMany({
      where: { productId: product.id },
    });

    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rate,
      0,
    );
    const finalRating = totalRating / allReviews.length;

    await this.productsRepository.update({
      where: { slug },
      data: {
        rating: finalRating,
      },
    });

    return newReview;
  }

  async getReviews(slug: string, page: number, limit: number) {
    const product = await this.productsRepository.get({
      where: { slug },
    });

    if (!product) {
      throw new AppException('Product not found', HttpStatus.NOT_FOUND, {
        className: this.constructor.name,
        methodName: this.getReviews.name,
      });
    }

    const reviews = await this.reviewsRepository.getMany({
      where: {
        productId: product.id,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = await this.reviewsRepository.count({
      where: {
        productId: product.id,
      },
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
