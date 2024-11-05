import { MEDIA_NAMES } from '@lib/entities/constans/media_names';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrAddDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEnum(MEDIA_NAMES, {
    message: 'Category must be one of the defined types.',
  })
  name: MEDIA_NAMES;

  @IsString()
  image: string;
}
