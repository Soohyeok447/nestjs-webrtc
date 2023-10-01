import { Router } from 'express';
import imageRouter from './imageRoute';
import authRouter from './authRoute';

const apiRouter = Router();

apiRouter.use('/images', imageRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;