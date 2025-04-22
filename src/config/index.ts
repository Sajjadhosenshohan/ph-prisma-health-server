import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_jwt_secret: process.env.REFRESH_TOKEN_JWT_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
  reset_password: {
    reset_pass_token: process.env.RESET_PASS_TOKEN,
    reset_pass_expires_in: process.env.RESET_PASS_EXPIRES_IN,
  },
  email_sender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
};
