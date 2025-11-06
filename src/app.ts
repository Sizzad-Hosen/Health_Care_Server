import express, { Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/User/user';

const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Health Care Server is running!' });
});



app.use('/api/v1', UserRoutes);

export default app;
