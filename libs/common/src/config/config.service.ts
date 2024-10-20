import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

export type Config = Record<
  'DATABASE_URL' | 'REDIS_STORE' | 'PORT',
  string | number
>;

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get<T extends keyof Config>(key: T): Config[T] {
    const value = this.nestConfigService.get<T>(key);
    return value as Config[T];
  }
}
