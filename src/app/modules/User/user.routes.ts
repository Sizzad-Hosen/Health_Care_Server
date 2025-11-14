import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/', UserControllers.createAdmin);

export const UserRoutes = router;
