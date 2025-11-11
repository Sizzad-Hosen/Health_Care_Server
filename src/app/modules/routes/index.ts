import express from 'express';
import { UserRoutes } from '../User/user.routes';
import { AdminRoutes } from '../Admin/admin.routes';
import { LoginRoutes } from '../Auth/auth.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/auth',
    route: LoginRoutes,
  },
];


moduleRoutes.forEach(r => router.use(r.path, r.route));

export default router;
