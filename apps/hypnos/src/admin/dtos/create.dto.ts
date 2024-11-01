import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  userId: string;

  @IsEnum({ admin: 'admin', user: 'user' })
  role: 'admin' | 'user';
}
