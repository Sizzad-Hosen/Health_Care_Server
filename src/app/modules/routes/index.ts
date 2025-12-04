import express from 'express';

import { AdminRoutes } from '../Admin/admin.routes';
import { LoginRoutes } from '../Auth/auth.routes';
import { userRoutes } from '../User/user.routes';
import { SpecialtiesRoutes } from '../Specalties/specalties.routes';
import { DoctorRoutes } from '../Doctor/doctor.routes';
import { PatientRoutes } from '../Patient/patient.routes';
import { ScheduleRoutes } from '../Schedule/schedule.routes';
import { DoctorScheduleRoutes } from '../DoctorSchedules/doctorSchedules.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/auth',
    route: LoginRoutes,
  },
  {
    path: '/specalties',
    route: SpecialtiesRoutes,
  },
  {
    path: '/doctor',
    route:DoctorRoutes
  },
  {
    path: '/patient',
    route:PatientRoutes
  },
  {
    path: '/schedules',
    route:ScheduleRoutes
  },
  {
    path: '/doctorSchedules',
    route:DoctorScheduleRoutes
  },
];


moduleRoutes.forEach(r => router.use(r.path, r.route));

export default router;
