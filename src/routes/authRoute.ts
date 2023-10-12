import { Router } from 'express';
import AuthController from '../controllers/authController';
import { verifyToken } from '../middlewares/jwt';

const authRouter = Router();

// user onboarding
authRouter.post('/onboard', AuthController.onBoard);

// token 유효성 확인 및 갱신
authRouter.post('/signin', verifyToken, AuthController.signIn);

// token 갱신
authRouter.post('/renew', verifyToken, AuthController.renew)


export default authRouter;