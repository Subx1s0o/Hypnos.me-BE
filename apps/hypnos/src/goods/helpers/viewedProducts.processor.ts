// import { Request } from 'express';
// import { PrismaService } from '@lib/common';
// import { Processor } from '@nestjs/bull';
// import { Injectable } from '@nestjs/common/decorators';
// import { Job } from 'bull';
// import { JwtService } from '@nestjs/jwt';

// interface ViewedProduct {
//   slug: string;
//   title: string;
//   category: string;
//   discountPercent?: number;
//   media: string;
//   price: number;
//   isPriceForPair: boolean;
//   viewedAt: Date;
// }

// @Injectable()
// @Processor('viewed-product')
// export class ViewedProductsProcessor {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async processViewedProduct(
//     job: Job<{ request: Request; product: ViewedProduct }>,
//   ) {
//     try {
//       const authHeader = job.data.request.headers.authorization;

//       if (!authHeader) return;

//       const token = authHeader.split(' ')[1];
//       const decoded = this.jwtService.decode(token);

//       if (!decoded || typeof decoded !== 'object' || !decoded['sub']) return;

//       const userId = decoded['sub'];

//       const user = await this.prisma.users.findUnique({
//         where: { id: userId },
//       });

//       if (!user) return;

//       const isAlreadyViewed = user.viewedProducts.some(
//         (prod) => prod.slug === job.data.product.slug,
//       );

//       if (!isAlreadyViewed) {
//         await this.prisma.users.update({
//           where: { id: userId },
//           data: {
//             viewedProducts: {
//               push: { product: job.data.product, viewedAt: new Date() },
//             },
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Error processing viewed product:', error);
//     }
//   }
// }
