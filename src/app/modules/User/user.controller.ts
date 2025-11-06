import { Request, Response } from 'express';
import { UserService } from './user.service';


  const createAdmin =  async (req: Request, res: Response) => {
    try {
      const data = req.body; 


      const admin = await UserService.createAdmin(data);


      res.status(201).json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create admin' });
    }
  }
export const UserControllers = {

createAdmin
}
