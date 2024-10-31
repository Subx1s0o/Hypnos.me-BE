/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'types';

export function omitPassword(
  user: User | User[],
): Omit<User, 'password'> | Omit<User, 'password'>[] {
  if (Array.isArray(user)) {
    return user.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
