import { Request, Response } from 'express';
import { resizeAndUploadImage } from '../services/imageService';

class ImageController {
  //이미지 1장 업로드
  public async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const resizedImageUrl = await resizeAndUploadImage(req.file);

      res.json({ result: 'success', url: resizedImageUrl });
    } catch (error) {
      res.status(500).json({ result: 'error', error });
    }
  }

  //이미지 여러장 업로드
  public async uploadImages(req: Request, res: Response): Promise<void> {
    try {
      const resizedImageUrls = await Promise.all(
        (req.files as Express.Multer.File[]).map(resizeAndUploadImage)
      );

      res.json({ result: 'success', urls: resizedImageUrls });
    } catch (error) {
      res.status(500).json({ result: 'error', error });
    }
  }

  //TODO GET 이미지

  //TODO GET 이미지들

}

export default new ImageController();