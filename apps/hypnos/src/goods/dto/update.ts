import { CATEGORIES } from '@lib/entities';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { CategoriesType } from 'types';

export class UpdateGoodDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  discountPercent: number;

  @IsNotEmpty()
  @IsEnum(CATEGORIES, {
    message:
      'Category must be one of the defined types: classic, neo_classic, conceptual, geometrical, symbolical, futuristic',
  })
  category: CategoriesType;

  @IsNotEmpty()
  price: number;

  @IsBoolean()
  isPriceForPair: boolean;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  thickness?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  pairWeight?: number;

  @IsArray()
  @IsNotEmpty()
  goldSamples: {
    sampleValue: string;
    weightMale: number;
    weightFemale: number;
  }[];
}

export class CategoryDto {
  @IsEnum(CATEGORIES)
  @IsOptional()
  category?: CategoriesType;
}
