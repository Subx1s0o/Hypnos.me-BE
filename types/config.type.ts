export type ConfigType = Record<
  | 'DATABASE_URL'
  | 'REDIS_STORE'
  | 'PORT'
  | 'JWT_SECRET'
  | 'MAILER_HOST'
  | 'MAILER_USERNAME'
  | 'MAILER_PASSWORD'
  | 'MAILER_FROM'
  | 'STRIPE_SECRET_KEY'
  | 'CLD_CLOUD_NAME'
  | 'CLD_API_KEY'
  | 'CLD_API_SECRET',
  string
>;
