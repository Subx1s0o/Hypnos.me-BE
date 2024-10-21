export type ConfigType = Record<
  'DATABASE_URL' | 'REDIS_STORE' | 'PORT' | 'JWT_SECRET',
  string | number
>;
