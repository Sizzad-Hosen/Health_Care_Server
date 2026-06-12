import express from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidationSchema } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.SUPER_ADMIN), AdminController.getAllAdmins);
router.get("/:id", auth(UserRole.SUPER_ADMIN), AdminController.getAdminById);
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(AdminValidationSchema.updateAdminValdation.filterAdmin),
  AdminController.updateAdmin
);
router.delete("/soft/:id", auth(UserRole.SUPER_ADMIN), AdminController.softDeleteAdmin);
router.delete("/:id", auth(UserRole.SUPER_ADMIN), AdminController.deleteAdmin);

export const AdminRoutes = router;
