import { CATEGORIES } from '@lib/entities';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CategoriesType } from 'types';

class MediaDto {
  @IsString()
  @IsDefined()
  main: string;

  @IsOptional()
  @IsString()
  media_1?: string;

  @IsOptional()
  @IsString()
  media_2?: string;

  @IsOptional()
  @IsString()
  media_3?: string;

  @IsOptional()
  @IsString()
  media_4?: string;
}

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

  @ValidateNested()
  @Type(() => MediaDto)
  media: MediaDto;

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
