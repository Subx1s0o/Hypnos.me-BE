import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true, example: 'SecurePassword123!' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: Array, required: true })
  @IsArray()
  cart: { productId: string; quantity: number }[];
}
