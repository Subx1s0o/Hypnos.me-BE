import { JsonValue } from '@prisma/client/runtime/library';

type BonusesHistoryEntry = {
  amount: number;
  receivedDate: Date;
  description: string;
};

type OrdersHistoryEntry = {
  productIds: string[];
};

export type User = {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  bonuses: number;
  role: 'admin' | 'user' | 'owner';
  bonusesHistory: BonusesHistoryEntry[];
  ordersHistory: OrdersHistoryEntry[];
  cart: JsonValue[];
  phone?: string;
  birthday?: Date;
  referredCode: string;
  referredBy?: string;
  subscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
};
