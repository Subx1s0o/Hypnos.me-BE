import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'OldSecurePassword123!',
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'NewSecurePassword456!',
  })
  @IsNotEmpty()
  newPassword: string;
}
