import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class GoodsQueryDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['electronics', 'fashion', 'home', 'books'])
  category?: string;
}
