import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGoodDto {
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsObject()
  media: Media;

  @IsInt()
  price: number;

  @IsBoolean()
  isPriceForPair: boolean;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  goldSamples: GoldSample[];
}

class GoldSample {
  @IsString()
  sampleValue: string;

  @IsNumber()
  weightMale: number;

  @IsNumber()
  weightFemale: number;
}

class Media {
  @IsString()
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
