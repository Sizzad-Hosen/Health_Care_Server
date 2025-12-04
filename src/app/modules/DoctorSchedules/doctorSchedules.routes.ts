import express from 'express';

import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { DoctorScheduleController } from './doctorSchedules.controller';
import { DoctorScheduleValidation } from './doctorSchedules.validation';
import { validateRequest } from '../../middlewares/validateRequest';


const router = express.Router();

/**
 * API ENDPOINT: /doctor-schedule/
 * 
 * Get all doctor schedule with filtering
 */
router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    DoctorScheduleController.getAllFromDB
);

router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
)

router.post(
    '/',
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.create),
    DoctorScheduleController.insertIntoDB
);

router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteFromDB
);


export const DoctorScheduleRoutes = router;