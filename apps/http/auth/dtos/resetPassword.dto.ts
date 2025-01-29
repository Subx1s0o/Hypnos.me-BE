import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'NewSecurePassword456!',
  })
  @IsNotEmpty()
  newPassword: string;
}
