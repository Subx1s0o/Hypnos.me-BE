import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ type: String, required: true, example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ type: String, required: true, example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  secondName: string;

  @ApiProperty({ type: Boolean, required: false, example: true })
  @IsBoolean()
  @IsOptional()
  subscribed?: boolean;

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
  @MinLength(7)
  password: string;

  @ApiProperty({ type: String, required: false, example: 'REF1234' })
  @IsOptional()
  @IsString()
  referredCode?: string;
}
