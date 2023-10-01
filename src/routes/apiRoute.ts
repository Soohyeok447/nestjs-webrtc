import { Router } from 'express';
import imageRouter from './imageRoute';

const router = Router();

router.use('/images', imageRouter); // 이미지 라우터

export default router;