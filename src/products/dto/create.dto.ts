import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { CATEGORIES, MEDIA_NAMES } from '@/core/constans';
import { MediaContent } from '@/core/global.dto';
import { CategoriesType } from 'types';

export class RingDetailsDto {
  @IsNotEmpty()
  @IsNumber()
  purityValue: number;

  @IsNotEmpty()
  @IsNumber()
  maleWeight: number;

  @IsNotEmpty()
  @IsNumber()
  femaleWeight: number;

  @IsOptional()
  @IsNumber()
  pairWeight?: number;
}

export class DiamondDetailsDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  diameter: number;

  @IsNotEmpty()
  @IsNumber()
  purity: number;

  @IsNotEmpty()
  color: string;
}

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
  discountPercent?: number;

  @IsNotEmpty()
  @IsEnum(CATEGORIES, {
    message:
      'Category must be one of the defined types: classic, neoclassic, conceptual, geometrical, symbolical, futuristic',
  })
  category: CategoriesType;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsBoolean()
  isPriceForPair: boolean;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  width: number;

  @IsNumber()
  thickness: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RingDetailsDto)
  ringDetails?: RingDetailsDto[];

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => DiamondDetailsDto)
  diamondDetails?: DiamondDetailsDto;

  @IsArray()
  @IsNumber({}, { each: true })
  sizeDetails?: number[];
}
