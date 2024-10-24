import { IsNotEmpty } from 'class-validator';

export class ApplyPromoCodeDto {
  @IsNotEmpty()
  code: string;
}
