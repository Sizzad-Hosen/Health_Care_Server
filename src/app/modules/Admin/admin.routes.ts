import express from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidationSchema } from "./admin.validation";

const router = express.Router();

// Use GET instead of POST
router.get("/", AdminController.getAllAdmins);
router.get("/:id", AdminController.getAdminById);
router.patch("/:id", validateRequest(AdminValidationSchema.updateAdminValdation.filterAdmin), AdminController.updateAdmin);
router.delete("/:id", AdminController.deleteAdmin);
router.delete("/soft/:id", AdminController.deleteAdmin);

export const AdminRoutes = router;
