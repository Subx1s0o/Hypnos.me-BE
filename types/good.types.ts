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
  media: {
    main: string;
    media_1?: string;
    media_2?: string;
    media_3?: string;
    media_4?: string;
  };
  price: number;
  isPriceForPair: boolean;
  description: string;
  width?: number;
  thickness?: number;
  weight?: number;
  pairWeight?: number;
  goldSamples: GoldSample[];
};
