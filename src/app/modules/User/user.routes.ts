import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { fileUploader } from '../../../helpars/fileUploder';
import { userValidation } from './user.validation';


const router = express.Router();
router.post(
  '/',
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {

    console.log("FILES:", req.file);
    console.log("BODY:", req.body);

    if (!req.body.data) {
      return res.status(400).json({ message: "Missing data field" });
    }

    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));

    return UserControllers.createAdmin(req, res);
  }
);


export const UserRoutes = router;
