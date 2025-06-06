export const config = {
  port: process.env.PORT,
  host: process.env.HOST,
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  admin: {
    login: process.env.ADMIN_LOGIN,
    password: process.env.ADMIN_PASSWORD,
  },
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  role: process.env.ROLE,
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    username: process.env.MAILER_USERNAME,
    password: process.env.MAILER_PASSWORD,
  },
  cloudinary: {
    cloudName: process.env.CLD_CLOUD_NAME,
    apiKey: process.env.CLD_API_KEY,
    apiSecret: process.env.CLD_API_SECRET,
  },
};
