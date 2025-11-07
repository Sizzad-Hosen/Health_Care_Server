import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

// Use GET instead of POST
router.get("/admin", AdminController.getAllDB);

export const AdminRoutes = router;
