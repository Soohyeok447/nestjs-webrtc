import { Router } from 'express';
import upload from '../middlewares/multer';
import ImageController from '../controllers/imageController';
import { verifyToken } from '../middlewares/jwt';
import { checkFormData } from '../middlewares/checkFormdata';

const imageRouter = Router();

// 이미지 여러장 POST
imageRouter.post(
  '/',
  verifyToken,
  checkFormData,
  upload.array('images'),
  ImageController.createImages,
);

// 이미지 여러장 PUT
imageRouter.put(
  '/',
  verifyToken,
  checkFormData,
  upload.array('images'),
  ImageController.updateImages,
);

// 내 이미지 GET
imageRouter.get('/me', verifyToken, ImageController.findMyImages);

// query로 이미지 GET
imageRouter.get('/:userId', verifyToken, ImageController.findImages);

export default imageRouter;
