import { Router } from 'express';
import AuthController from '../controllers/authController';

const authRouter = Router();

// token 유효성 확인 및 발급
authRouter.post('/signin', AuthController.fetchOrGenerateToken);

// token 갱신
authRouter.post('/renew', AuthController.renewToken)


export default authRouter;