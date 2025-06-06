import { CATEGORIES } from '@/core/constans/CATEGORIES';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class CategoryDto {
  @IsEnum(CATEGORIES, {
    message:
      'Category must be one of the defined types: classic, neo_classic, conceptual, geometrical, symbolical, futuristic',
  })
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase().trim())
  category?: string;
}
