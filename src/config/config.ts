import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.MONGODB_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  frontEndDomain: process.env.FRONTEND_DOMAIN,
};

export const config = Object.freeze(_config);
