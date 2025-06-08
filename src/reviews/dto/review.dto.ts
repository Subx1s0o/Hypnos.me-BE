import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ReviewDto {
  @IsNumber()
  @Min(1, {
    message: 'Rating must be set at least 1',
  })
  @Max(5, {
    message: 'Rating must be at most 5',
  })
  @IsInt({
    message: 'Rating must be a whole number',
  })
  rate: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  comment: string;
}
