import { good } from './good.types';

export type User = {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  password: string;
  subscribed?: boolean;
  bonuses: number;
  bonusesHistory: bonusesHistory[];
  ordersHistory: ordersHistory[];
  cart: good[];
  phone: number;
  birthday: Date;
  referredCode: string;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

type bonusesHistory = {
  amount: number;
  receivedDate: Date;
  description: string;
};

type ordersHistory = {
  productIds: string[];
};
