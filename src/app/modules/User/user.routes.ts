import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/',auth('SUPER_ADMIN'), UserControllers.createAdmin);

export const UserRoutes = router;
