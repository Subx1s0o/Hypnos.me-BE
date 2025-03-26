import { PrismaService } from '@/libs/common';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ViewedProductsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  @MessagePattern('viewed-product')
  async processViewedProduct({ user, slug }: { user: string; slug: string }) {
    console.log('hello');
    this.logger.log('Processing viewed product');
    try {
      const product = await this.prisma.products.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
      await this.prisma.viewedProducts.create({
        data: {
          userId: user || null,
          productId: product.id,
          date: new Date(),
        },
      });
    } catch {
      this.logger.error('Error while processing viewed product');
    }
  }
}
