import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../../helpars/fileUploder';
import { userValidation } from './user.validation';
import { UserControllers } from './user.controller';
import { UserRole } from '@prisma/client';

const router = express.Router();

// router.get(
//     '/',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     userController.getAllFromDB
// );

// router.get(
//     '/me',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
//     UserControllers.getMyProfile
// )

router.post(
    "/create-admin",
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return UserControllers.createAdmin(req, res, next)
    }
);


router.post(
    "/create-doctor",
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        console.log(JSON.parse(req.body.data))
        req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
        return UserControllers.createDoctor(req, res, next)
    }
);

// router.post(
//     "/create-patient",
//     fileUploader.upload.single('file'),
//     (req: Request, res: Response, next: NextFunction) => {
//         req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
//         return userController.createPatient(req, res, next)
//     }
// );

// router.patch(
//     '/:id/status',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     validateRequest(userValidation.updateStatus),
//     userController.changeProfileStatus
// );

// router.patch(
//     "/update-my-profile",
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
//     fileUploader.upload.single('file'),
//     (req: Request, res: Response, next: NextFunction) => {
//         req.body = JSON.parse(req.body.data)
//         return userController.updateMyProfie(req, res, next)
//     }
// );


export const userRoutes = router;