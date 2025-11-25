import express from 'express';

import { AdminRoutes } from '../Admin/admin.routes';
import { LoginRoutes } from '../Auth/auth.routes';
import { userRoutes } from '../User/user.routes';
import { SpecialtiesRoutes } from '../Specalties/specalties.routes';

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
];


moduleRoutes.forEach(r => router.use(r.path, r.route));

export default router;
