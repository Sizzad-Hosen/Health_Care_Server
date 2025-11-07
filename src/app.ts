import express from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/User/user.routes";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({ message: "Health Care Server is running!" });
});

app.use("/api/v1", UserRoutes);
app.use("/api/v1", AdminRoutes);

export default app;
