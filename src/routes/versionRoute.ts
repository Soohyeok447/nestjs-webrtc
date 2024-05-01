import { Router } from 'express';
import VersionController from '../controllers/versionController';

const versionRouter = Router();

// 내 이미지 GET
versionRouter.get('/', VersionController.getAppVersion);

export default versionRouter;
