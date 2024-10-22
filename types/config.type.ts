export type ConfigType = Record<
  | 'DATABASE_URL'
  | 'REDIS_STORE'
  | 'PORT'
  | 'JWT_SECRET'
  | 'MAILER_HOST'
  | 'MAILER_USERNAME'
  | 'MAILER_PASSWORD'
  | 'MAILER_FROM',
  string | number
>;
