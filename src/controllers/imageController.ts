import { Request, Response } from 'express';
import * as imageService from '../services/imageService';

class ImageController {
  //이미지 여러장 업로드
  public async uploadImages({ files }: Request, res: Response): Promise<void> {
    try {
      const resizedImageUrls = await Promise.all(
        (files as Express.Multer.File[]).map(imageService.resizeAndUploadImage)
      );

      res.status(201).json({ urls: resizedImageUrls });
    } catch (error) {
      console.log(error)

      res.status(500).json({ error: error });
    }
  }

  //이미지 1장 업로드
  public async uploadImage({ file }: Request, res: Response): Promise<void> {
    try {
      const resizedImageUrl = await imageService.resizeAndUploadImage(file);

      res.status(201).json({ url: resizedImageUrl });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  }

  //TODO GET 이미지

  //TODO GET 이미지들

}

export default new ImageController();