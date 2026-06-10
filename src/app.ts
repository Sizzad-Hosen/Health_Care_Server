import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import router from "./app/modules/routes";

import { notFoundHandler } from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(cookieParser());
app.get("/", (req, res) => {
  res.send({ message: "Health Care Server is running!" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", router);
app.use(notFoundHandler)
app.use(globalErrorHandler)
export default app;
