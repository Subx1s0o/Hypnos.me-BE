import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePromoCodeDto {
  @ApiProperty({ example: 'DISCOUNT10' })
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 10, description: 'Percentage discount' })
  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @ApiProperty({ example: 4, description: 'The count of available promocodes' })
  @IsNumber()
  count: number;

  @ApiProperty({ example: '2024-12-31', description: 'Expiration date' })
  @IsDateString()
  expirationDate: string;
}
