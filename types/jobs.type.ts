import { MEDIA_NAMES } from '@lib/entities';

export type GoodsJobType = {
  id: string;
  media: {
    [key in MEDIA_NAMES]: string;
  };
};
