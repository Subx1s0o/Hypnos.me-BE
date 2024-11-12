import { CATEGORIES } from '@lib/entities';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CategoriesType } from 'types';

@Injectable()
export class ParseCategoryPipe implements PipeTransform {
  transform(value: CategoriesType): CategoriesType {
    if (!Object.values(CATEGORIES).includes(value)) {
      throw new BadRequestException(
        `Invalid category. Must be one of: ${Object.values(CATEGORIES).join(', ')}`,
      );
    }
    return value;
  }
}
