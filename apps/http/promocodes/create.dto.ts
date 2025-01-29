import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePromocodeDto {
  @ApiProperty({ type: String, required: true, example: 'DISCOUNT10' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 10,
    description: 'Percentage discount',
  })
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 4,
    description: 'The count of available promocodes',
  })
  @IsNumber()
  count: number;

  @ApiProperty({
    type: String,
    required: true,
    example: '2024-12-31',
    description: 'Expiration date',
  })
  @IsDateString()
  expirationDate: string;
}
