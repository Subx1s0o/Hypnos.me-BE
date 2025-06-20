import { MEDIA_NAMES } from '@/core/constans';
import { MediaContent } from '@/core/constans';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class MediaData {
  @IsString()
  mediaId: string;

  @ValidateNested()
  @Type(() => MediaContent)
  media: {
    [key in MEDIA_NAMES]: string;
  };
}
