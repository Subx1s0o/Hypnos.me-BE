import { MEDIA_NAMES } from '@lib/entities';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrAddDto {
  @IsNotEmpty()
  @IsEnum(MEDIA_NAMES, {
    message: 'Category must be one of the defined types.',
  })
  name: MEDIA_NAMES;

  @IsString()
  image: string;
}
