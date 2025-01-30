import { CATEGORIES } from 'src/libs/entities';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CategoriesType } from '@types';

@Injectable()
export class ParseCategoryPipe implements PipeTransform {
  transform(value: CategoriesType | undefined): CategoriesType | undefined {
    if (value === undefined) {
      return value;
    }

    if (!Object.values(CATEGORIES).includes(value)) {
      throw new BadRequestException(
        `Invalid category. Must be one of: ${Object.values(CATEGORIES).join(', ')}`,
      );
    }

    return value;
  }
}
