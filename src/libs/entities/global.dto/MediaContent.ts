import { IsOptional, IsString } from 'class-validator';

export class MediaContent {
  @IsString()
  main: string;

  @IsString()
  @IsOptional()
  media_1?: string;

  @IsString()
  @IsOptional()
  media_2?: string;

  @IsString()
  @IsOptional()
  media_3?: string;

  @IsString()
  @IsOptional()
  media_4?: string;
}
