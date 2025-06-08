import { CATEGORIES } from '@/core/constans';
import { Injectable, PipeTransform, HttpStatus } from '@nestjs/common';
import { AppException } from '@/core/exceptions/app.exception';
import { CategoriesType } from 'types';

@Injectable()
export class ParseCategoryPipe implements PipeTransform {
  transform(value: CategoriesType | undefined): CategoriesType | undefined {
    if (value === undefined) {
      return value;
    }

    if (!Object.values(CATEGORIES).includes(value)) {
      throw new AppException(
        `Invalid category. Must be one of: ${Object.values(CATEGORIES).join(', ')}`,
        HttpStatus.BAD_REQUEST,
        {
          className: this.constructor.name,
          methodName: this.transform.name,
        },
      );
    }

    return value;
  }
}
