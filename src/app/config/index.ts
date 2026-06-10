import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  EXPIRE_IN: z.string().min(1, "EXPIRE_IN is required"),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1, "REFRESH_TOKEN_EXPIRES_IN is required"),
  RESET_PASS_TOKEN: z.string().min(1, "RESET_PASS_TOKEN is required"),
  RESET_PASS_TOKEN_EXPIRES_IN: z.string().min(1, "RESET_PASS_TOKEN_EXPIRES_IN is required"),
  RESET_PASS_URL: z.string().url("RESET_PASS_URL must be a valid URL"),
  EMAIL: z.string().min(1, "EMAIL is required"),
  APP_PASS: z.string().min(1, "APP_PASS is required"),
  SALT_ROUND: z.coerce.number().int().positive().default(12),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  STORE_ID: z.string().min(1, "STORE_ID is required"),
  STORE_PASS: z.string().min(1, "STORE_PASS is required"),
  SUCCESS_URL: z.string().url("SUCCESS_URL must be a valid URL"),
  CANCEL_URL: z.string().url("CANCEL_URL must be a valid URL"),
  FAIL_URL: z.string().url("FAIL_URL must be a valid URL"),
  SSL_PAYMENT_API: z.string().url("SSL_PAYMENT_API must be a valid URL"),
  SSL_VALIDATIOIN_API: z.string().url("SSL_VALIDATIOIN_API must be a valid URL"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment configuration: ${formattedErrors}`);
}

const env = parsedEnv.data;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  jwt: {
    jwt_secret: env.JWT_SECRET,
    expires_in: env.EXPIRE_IN,
    refresh_token_secret: env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: env.REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: env.RESET_PASS_TOKEN,
    reset_pass_token_expires_in: env.RESET_PASS_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: env.RESET_PASS_URL,
  email: env.EMAIL,
  app_pass: env.APP_PASS,
  salt_round: env.SALT_ROUND,
  cloudinary_name: env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: env.CLOUDINARY_API_SECRET,
  ssl: {
    storeId: env.STORE_ID,
    storePass: env.STORE_PASS,
    successUrl: env.SUCCESS_URL,
    cancelUrl: env.CANCEL_URL,
    failUrl: env.FAIL_URL,
    sslPaymentApi: env.SSL_PAYMENT_API,
    sslValidationApi: env.SSL_VALIDATIOIN_API,
  },
};
