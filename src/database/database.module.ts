import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PromocodesRepository } from './repositories/promocodes.repository';
import { ProductsRepository } from './repositories/products.repository';
import { ReviewsRepository } from './repositories/reviews.repository';
import { UserRepository } from './repositories/user.repository';
import { ViewedProductsRepository } from './repositories/viewed-products.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    PromocodesRepository,
    ProductsRepository,
    ReviewsRepository,
    UserRepository,
    ViewedProductsRepository,
  ],
  exports: [
    PrismaService,
    PromocodesRepository,
    ProductsRepository,
    ReviewsRepository,
    UserRepository,
    ViewedProductsRepository,
  ],
})
export class DatabaseModule {}
