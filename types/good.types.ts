type GoldSample = {
  sampleValue: string;
  weightMale: number;
  weightFemale: number;
};

export type good = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  price: number;
  isPriceForPair: boolean;
  description: string;
  width?: number;
  thickness?: number;
  weight?: number;
  pairWeight?: number;
  goldSamples: GoldSample[];
};
