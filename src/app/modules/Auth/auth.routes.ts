import express from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", AuthControllers.loginUser);

router.post("/refreshtoken", AuthControllers.refreshToken);

router.post("/forgot-password", AuthControllers.forgotPasword);

router.post("/change-password", auth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ), AuthControllers.changePasword);

    
router.post(
    '/reset-password',
    AuthControllers.resetPassword
)

export const LoginRoutes = router;
