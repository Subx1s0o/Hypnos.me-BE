import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  secondName: string;

  @IsBoolean()
  @IsOptional()
  subscribed?: boolean;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsOptional()
  @IsString()
  referredCode?: string;

  @IsArray()
  @IsOptional()
  cart: { productId: string; quantity: number }[];
}
