import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";

Object.assign(process.env, {
  NODE_ENV: "test",
  PORT: "5000",
  DATABASE_URL: "postgresql://test:test@localhost:5432/test?schema=public",
  JWT_SECRET: "test-jwt-secret",
  EXPIRE_IN: "1d",
  REFRESH_TOKEN_SECRET: "test-refresh-secret",
  REFRESH_TOKEN_EXPIRES_IN: "30d",
  RESET_PASS_TOKEN: "test-reset-secret",
  RESET_PASS_TOKEN_EXPIRES_IN: "10m",
  RESET_PASS_URL: "http://localhost:3000/reset-password",
  EMAIL: "test@example.com",
  APP_PASS: "test-app-pass",
  SALT_ROUND: "12",
  CLOUDINARY_CLOUD_NAME: "test-cloud",
  CLOUDINARY_API_KEY: "test-key",
  CLOUDINARY_API_SECRET: "test-secret",
  STORE_ID: "test-store",
  STORE_PASS: "test-store-pass",
  SUCCESS_URL: "http://localhost:5000/payment/success",
  CANCEL_URL: "http://localhost:5000/payment/cancel",
  FAIL_URL: "http://localhost:5000/payment/fail",
  SSL_PAYMENT_API: "https://example.com/payment",
  SSL_VALIDATIOIN_API: "https://example.com/validate",
});

const getApp = async () => {
  const appModule = await import("./app");
  return appModule.default;
};

test("GET / returns the server status message", async () => {
  const app = await getApp();

  const response = await request(app).get("/").expect(200);

  assert.deepEqual(response.body, {
    message: "Health Care Server is running!",
  });
});

test("GET /health returns a healthy response", async () => {
  const app = await getApp();

  const response = await request(app).get("/health").expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.message, "ok");
  assert.equal(typeof response.body.uptime, "number");
  assert.match(response.body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test("unknown routes return the centralized not found response", async () => {
  const app = await getApp();

  const response = await request(app).get("/missing-route").expect(404);

  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "API endpoint not found");
  assert.equal(response.body.errorMessages[0].path, "/missing-route");
});
