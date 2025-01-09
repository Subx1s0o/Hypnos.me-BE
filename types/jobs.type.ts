import { MEDIA_NAMES } from '@lib/entities';

export type ImageJobType = {
  id: string;
  media: {
    [key in MEDIA_NAMES]: string;
  };
};
