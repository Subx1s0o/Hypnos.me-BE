import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsArray()
  cart: { productId: string; quantity: number }[];
}
