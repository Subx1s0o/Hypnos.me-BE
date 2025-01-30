import { MEDIA_NAMES } from 'src/libs/entities';

export type ImageJobType = {
  id: string;
  media: {
    [key in MEDIA_NAMES]: string;
  };
};
