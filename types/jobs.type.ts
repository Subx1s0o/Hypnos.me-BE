import { MEDIA_NAMES } from '@/core/constans/MEDIA_NAMES';

export type ImageJobType = {
  id: string;
  media: {
    [key in MEDIA_NAMES]: string;
  };
};
