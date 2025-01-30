import { User } from 'src/types/user.type';
import { TokensResponse } from './tokens-response.type';

export type AuthResponse = TokensResponse & {
  user: Omit<User, 'password'>;
};
