import { Router } from 'express';
import imageRouter from './imageRoute';
import authRouter from './authRoute';
import healthRouter from './healthRoute';
import userRouter from './userRoute';
import blockLogRouter from './blockLogRoute';

const apiRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: health check
 */
apiRouter.use('/health', healthRouter);

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: 이미지 추가, 수정, 조회
 */
apiRouter.use('/images', imageRouter);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 수정, 조회
 */
apiRouter.use('/users', userRouter);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 토큰 발급, 갱신
 */
apiRouter.use('/auth', authRouter);

/**
 * @swagger
 * tags:
 *   name: BlockLog
 *   description: 차단관리
 */
apiRouter.use('/blockLog', blockLogRouter);

export default apiRouter;
