import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductsRepository } from '@/database/repositories/products.repository';
import { ViewedProductsRepository } from '@/database/repositories/viewed-products.repository';

@Injectable()
export class ViewedProcessor {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly viewedProductsRepository: ViewedProductsRepository,
  ) {}

  @OnEvent('viewed')
  async processViewedProduct(payload: { user: string | null; slug: string }) {
    const { user, slug } = payload;
    try {
      const product = await this.productsRepository.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });

      if (user) {
        // Clean up old viewed products (older than 30 days)
        await this.viewedProductsRepository.deleteMany({
          where: {
            userId: user,
            date: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        });

        // Upsert the current viewed product
        await this.viewedProductsRepository.upsert({
          where: {
            userId_productId: {
              userId: user,
              productId: product.id,
            },
          },
          update: { date: new Date() },
          create: {
            userId: user,
            productId: product.id,
            date: new Date(),
          },
        });
      } else {
        return;
      }
    } catch (error) {
      console.error('Error processing viewed product', error);
    }
  }
}
