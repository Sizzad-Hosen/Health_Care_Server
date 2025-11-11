import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

// Use GET instead of POST
router.get("/", AdminController.getAllDB);
router.get("/:id", AdminController.getIdByDB);
router.patch("/:id", AdminController.updateByIdInDB);
router.delete("/:id", AdminController.deleteByIdInDB);
router.delete("/soft/:id", AdminController.deleteByIdInDB);

export const AdminRoutes = router;
