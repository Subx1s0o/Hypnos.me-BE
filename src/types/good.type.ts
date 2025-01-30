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

export type CategoriesType = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export type RingDetails = {
  purityValue: number;
  maleWeight: number;
  femaleWeight: number;
  pairWeight?: number;
};

export type DiamondDetails = {
  quantity: number;
  weight: number;
  diameter: number;
  purity: number;
  color: string;
};

export type Good = {
  id: string;
  title: string;
  slug: string;
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
  ringDetails: RingDetails[];
  diamondDetails: DiamondDetails;
  sizeDetails: number[];
};

export type GoodPreview = {
  category: CategoriesType;
  discountPercent: number;
  media: { main: { url: string; status: MediaStatusType } };
  id: string;
  price: number;
  isPriceForPair: boolean;
  slug: string;
  title: string;
};
