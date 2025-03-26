import { PrismaService } from '@/libs/common';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ViewedProductsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  @MessagePattern('viewed-product')
  async processViewedProduct(
    @Payload() payload: { user: string | null; slug: string },
  ) {
    try {
      const product = await this.prisma.products.update({
        where: { slug: payload.slug },
        data: { views: { increment: 1 } },
      });

      if (payload.user) {
        await this.prisma.$transaction(async (tx) => {
          await tx.viewedProducts.deleteMany({
            where: {
              userId: payload.user,
              date: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          });

          await tx.viewedProducts.upsert({
            where: {
              userId_productId: {
                userId: payload.user,
                productId: product.id,
              },
            },
            update: { date: new Date() },
            create: {
              userId: payload.user,
              productId: product.id,
              date: new Date(),
            },
          });
        });
      } else {
        return;
      }
    } catch (error) {
      this.logger.error('Error processing viewed product', error);
    }
  }
}
