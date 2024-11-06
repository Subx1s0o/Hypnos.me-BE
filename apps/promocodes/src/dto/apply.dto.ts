import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ApplyPromocodeDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  code: string;
}
