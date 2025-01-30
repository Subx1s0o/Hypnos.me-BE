import { MEDIA_NAMES } from 'src/libs/entities/constans';
import { MediaContent } from 'src/libs/entities/global.dto/MediaContent';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class MediaData {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => MediaContent)
  media: {
    [key in MEDIA_NAMES]: string;
  };
}
