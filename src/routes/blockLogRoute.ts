import { Router } from 'express';
import blockLogController from '../controllers/blockLogController';
import { verifyToken } from '../middlewares/jwt';

const blockLogRouter = Router();

// 유저 차단
blockLogRouter.put('/block', verifyToken, blockLogController.blockUser);

// 유저 차단해제
blockLogRouter.put('/unblock', verifyToken, blockLogController.unblockUser);

// 차단된 유저 찾기
blockLogRouter.get('/me', verifyToken, blockLogController.findBlockLog);

export default blockLogRouter;
