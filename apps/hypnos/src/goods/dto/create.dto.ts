import { CATEGORIES, MEDIA_NAMES, MediaContent } from '@lib/entities';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateGoodDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MediaContent)
  media: {
    [key in MEDIA_NAMES]: string;
  };

  @IsOptional()
  @IsNumber()
  @Min(1)
  discountPercent: number;

  @IsNotEmpty()
  @IsEnum(CATEGORIES, {
    message:
      'Category must be one of the defined types: classic, neo_classic, conceptual, geometrical, symbolical, futuristic',
  })
  category: CATEGORIES;

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
