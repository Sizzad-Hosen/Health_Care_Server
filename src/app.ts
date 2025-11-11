import express from "express";
import cors from "cors";

import router from "./app/modules/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFoundHandler } from "./app/middlewares/notFound";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Health Care Server is running!" });
});

app.use("/api/v1", router);
app.use(globalErrorHandler)
app.use(notFoundHandler)
export default app;
