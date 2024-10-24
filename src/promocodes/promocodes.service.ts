import { PrismaService } from '@lib/common';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePromoCodeDto } from './dto';

@Injectable()
export class PromocodesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPromoCodeDto: CreatePromoCodeDto) {
    const promo = await this.prisma.promocodes.findUnique({
      where: { code: createPromoCodeDto.code },
    });

    if (promo) {
      throw new ConflictException('The Promocode with same name already exist');
    }

    await this.prisma.promocodes.create({
      data: {
        code: createPromoCodeDto.code,
        discount: createPromoCodeDto.discount,
        count: createPromoCodeDto.count,
        expirationDate: createPromoCodeDto.expirationDate,
      },
    });

    throw new HttpException(
      'Promocode was successfully created',
      HttpStatus.OK,
    );
  }

  async findAll() {
    return await this.prisma.promocodes.findMany();
  }

  async remove(id: string) {
    try {
      await this.prisma.promocodes.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException("The promocode with that ID wasn't found");
    }
    throw new HttpException(
      'Promocode was successfully deleted',
      HttpStatus.OK,
    );
  }
  async applyPromoCode(code: string) {
    const promoCode = await this.prisma.promocodes.findUnique({
      where: { code },
    });

    if (!promoCode) {
      throw new NotFoundException('Promocode not found');
    }

    const now = new Date();
    if (promoCode.expirationDate < now) {
      await this.prisma.promocodes.delete({
        where: { code },
      });
      throw new BadRequestException('Promocode has expired');
    }

    if (promoCode.count <= 0) {
      await this.prisma.promocodes.delete({
        where: { code },
      });
      throw new BadRequestException('Promocode has been used up');
    }

    const discount = promoCode.discount;

    await this.prisma.promocodes.update({
      where: { code },
      data: {
        count: promoCode.count - 1,
      },
    });

    throw new HttpException(
      {
        message: 'Promocode applied successfully',
        discount,
      },
      HttpStatus.OK,
    );
  }
}
