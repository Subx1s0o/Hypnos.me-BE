import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MEDIA_NAMES } from '@/core/constans/MEDIA_NAMES';

export class UpdateOrAddDto {
  @IsNotEmpty()
  @IsEnum(MEDIA_NAMES, {
    message: 'Category must be one of the defined types.',
  })
  name: MEDIA_NAMES;

  @IsString()
  image: string;
}
