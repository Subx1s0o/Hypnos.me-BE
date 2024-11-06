import { CATEGORIES } from '@lib/entities/constans';
import { MediaStatusType } from './media-status.type';

type MediaDetail = {
  url: string;
  status: MediaStatusType;
};

type Media = {
  main: MediaDetail;
  media_1?: MediaDetail;
  media_2?: MediaDetail;
  media_3?: MediaDetail;
  media_4?: MediaDetail;
};

type GoldSample = {
  sampleValue: string;
  weightMale: number;
  weightFemale: number;
};

export type CategoriesType = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export type Good = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  media: Media;
  price: number;
  discountPercent?: number;
  isPriceForPair: boolean;
  description: string;
  category: CategoriesType;
  width?: number;
  thickness?: number;
  views: number;
  quantity: number;
  weight?: number;
  pairWeight?: number;
  goldSamples: GoldSample[];
};
