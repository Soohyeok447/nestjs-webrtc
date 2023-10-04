import { Router } from 'express';
import imageRouter from './imageRoute';
import authRouter from './authRoute';

const apiRouter = Router();

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
 *   name: Auth
 *   description: 토큰 발급, 갱신
 */
apiRouter.use('/auth', authRouter);

export default apiRouter;