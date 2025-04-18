import { Request } from 'express';
import { Role } from './role.type';

type BonusesHistoryEntry = {
  amount: number;
  receivedDate: Date;
  description: string;
};

export type User = {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  bonuses: number;
  role: Role;
  bonusesHistory: BonusesHistoryEntry[];
  phone?: string;
  birthday?: Date;
  referredCode: string;
  referredBy?: string;
  subscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthRequest = Request & { user?: { id: string; role: Role } };
