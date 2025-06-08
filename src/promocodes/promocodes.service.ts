import { Injectable } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { AppException } from '@/core/exceptions/app.exception';
import { CreatePromocodeDto } from './create.dto';
import { PromocodesRepository } from '@/database/repositories/promocodes.repository';

@Injectable()
export class PromocodesService {
  constructor(private readonly promocodesRepository: PromocodesRepository) {}

  async createPromocode(data: CreatePromocodeDto) {
    const promoncodeData = await this.promocodesRepository.get({
      where: { code: data.code },
    });

    if (promoncodeData) {
      throw new AppException(
        'Promocode with this code already exists.',
        HttpStatus.CONFLICT,
        {
          className: this.constructor.name,
          methodName: this.createPromocode.name,
          body: data,
        },
      );
    }

    await this.promocodesRepository.create({
      data,
    });

    throw new AppException(
      'Promocode created successfully.',
      HttpStatus.CREATED,
      {
        className: this.constructor.name,
        methodName: this.createPromocode.name,
        body: data,
      },
    );
  }

  async findAll() {
    return await this.promocodesRepository.getMany();
  }

  async remove(id: string) {
    const promo = await this.promocodesRepository.get({ where: { id } });

    if (!promo) {
      throw new AppException('Promocode not found.', HttpStatus.NOT_FOUND, {
        className: this.constructor.name,
        methodName: this.remove.name,
        params: { id },
      });
    }

    await this.promocodesRepository.delete({ where: { id } });

    throw new AppException(
      'Promocode was successfully deleted.',
      HttpStatus.OK,
      {
        className: this.constructor.name,
        methodName: this.remove.name,
        params: { id },
      },
    );
  }

  async applyPromoCode(code: string) {
    const promoCode = await this.promocodesRepository.get({
      where: { code },
    });

    if (!promoCode) {
      throw new AppException('Promocode not found.', HttpStatus.NOT_FOUND, {
        className: this.constructor.name,
        methodName: this.applyPromoCode.name,
        params: { code },
      });
    }

    const now = new Date();
    if (promoCode.expirationDate < now) {
      await this.promocodesRepository.delete({ where: { code } });
      throw new AppException('Promocode has expired.', HttpStatus.BAD_REQUEST, {
        className: this.constructor.name,
        methodName: this.applyPromoCode.name,
        params: { code },
      });
    }

    if (promoCode.count <= 0) {
      await this.promocodesRepository.delete({ where: { code } });
      throw new AppException(
        'Promocode has been used up.',
        HttpStatus.BAD_REQUEST,
        {
          className: this.constructor.name,
          methodName: this.applyPromoCode.name,
          params: { code },
        },
      );
    }

    const discount = promoCode.discount;

    await this.promocodesRepository.update({
      where: { code },
      data: { count: promoCode.count - 1 },
    });

    throw new AppException(
      `Promocode applied successfully. Discount: ${discount}%`,
      HttpStatus.OK,
      {
        className: this.constructor.name,
        methodName: this.applyPromoCode.name,
        params: { code },
      },
    );
  }
}
