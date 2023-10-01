import { Router } from 'express';
import { upload } from '../middlewares/multer';
import imageController from '../controllers/imageController';

const imageRouter = Router();

// POST /images 이미지 여러장 POST
imageRouter.post('/', upload.array('images'), imageController.uploadImages);

// POST /image 이미지 1장 POST
imageRouter.post('/single', upload.single('image'), imageController.uploadImage);

//TODO GET 이미지

//TODO GET 이미지들

export default imageRouter;