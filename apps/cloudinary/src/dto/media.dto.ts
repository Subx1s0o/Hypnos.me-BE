import { MEDIA_NAMES } from '@lib/entities/constans/media_names';
import { MediaContent } from '@lib/entities/globals/MediaContent';
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