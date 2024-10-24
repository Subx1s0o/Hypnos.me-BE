import { ApiProperty } from '@nestjs/swagger';

export class PromoCode {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  expirationDate: Date;
}
