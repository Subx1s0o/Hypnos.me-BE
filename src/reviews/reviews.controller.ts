import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':slug')
  @HttpCode(204)
  async reviewGood(@Param('slug') slug: string, @Body() data: ReviewDto) {
    return await this.reviewsService.createReview(slug, data);
  }

  @Get(':slug')
  async getReviews(
    @Param('slug') slug: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.reviewsService.getReviews(slug, +page || 1, +limit || 10);
  }
}
