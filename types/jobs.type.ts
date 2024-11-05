import { MEDIA_NAMES } from '@lib/entities/constans/media_names';

export type GoodsJobType = {
  id: string;
  media: {
    [key in MEDIA_NAMES]: string;
  };
};
