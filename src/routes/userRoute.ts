import { Router } from 'express';
import { verifyToken } from '../middlewares/jwt';
import UserController from '../controllers/userController';

const userRouter = Router();

// user 수정
userRouter.put('/', verifyToken, UserController.update);

// user 본인 조회
userRouter.get('/me', verifyToken, UserController.findMe);

// id로 유저 조회
userRouter.get('/:id', verifyToken, UserController.findById);

export default userRouter;
