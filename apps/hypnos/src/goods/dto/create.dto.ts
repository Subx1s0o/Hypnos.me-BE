import { CATEGORIES } from '@lib/entities/constans/CATEGORIES';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateGoodDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  media: {
    main: string | null;
    media_1?: string | null;
    media_2?: string | null;
    media_3?: string | null;
    media_4?: string | null;
  };

  @IsOptional()
  @IsNumber()
  @Min(1)
  discountPercent: number;

  @IsNotEmpty()
  @IsEnum(CATEGORIES, { message: 'Category must be one of the defined types.' })
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
