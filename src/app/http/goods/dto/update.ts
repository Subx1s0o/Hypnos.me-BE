import { CATEGORIES } from 'src/libs/entities';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { CategoriesType } from 'src/types';

export class UpdateGoodDto {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  discountPercent: number;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(CATEGORIES, {
    message:
      'Category must be one of the defined types: classic, neo_classic, conceptual, geometrical, symbolical, futuristic',
  })
  category: CategoriesType;

  @IsNotEmpty()
  @IsOptional()
  price: number;

  @IsBoolean()
  @IsOptional()
  isPriceForPair: boolean;

  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
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
  @IsOptional()
  goldSamples: {
    sampleValue: string;
    weightMale: number;
    weightFemale: number;
  }[];
}
