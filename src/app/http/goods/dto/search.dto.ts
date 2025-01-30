import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SearchDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;
}
