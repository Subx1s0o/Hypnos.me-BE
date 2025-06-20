export type Review = {
  id: string;
  name: string;
  email: string;
  comment: string;
  rate: number; // Integer between 1-5
  productId: string;
  createdAt: Date;
  updatedAt: Date;
};
