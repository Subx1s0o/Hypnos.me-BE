import { CATEGORIES } from '@/core/constans/CATEGORIES';
import { CategoriesType } from 'types';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ProductCatalogQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CATEGORIES, {
    message:
      'Category must be one of the defined types: classic, neo_classic, conceptual, geometrical, symbolical, futuristic',
  })
  category?: CategoriesType;

  @IsOptional()
  @IsEnum(['asc-price', 'desc-price', 'popularity', 'newest', 'most-viewed'], {
    message:
      'Order must be one of the defined types: asc-price, desc-price, popularity, newest, most-viewed',
  })
  order?: 'asc-price' | 'desc-price' | 'popularity' | 'newest' | 'most-viewed';

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value ? Number(value) : 0))
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => (value ? Number(value) : 0))
  maxPrice?: number;
}
