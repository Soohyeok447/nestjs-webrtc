import { Request, Response } from 'express';
import * as imageService from '../services/imageService';
// import { resizeAndUploadImage } from '../services/imageService';

class ImageController {
  //이미지 여러장 업로드
  public async uploadImages({ files }: Request, res: Response): Promise<void> {
    console.log("uploadImages 호출됨")
    try {
      const resizedImageUrls = await Promise.all(
        (files as Express.Multer.File[]).map(imageService.resizeAndUploadImage)
      );

      res.json({ result: 'success', urls: resizedImageUrls });
    } catch (error) {
      console.log(error)

      res.status(500).json({ result: 'error', error: error });
    }
  }

  //이미지 1장 업로드
  public async uploadImage({ file }: Request, res: Response): Promise<void> {
    try {
      const resizedImageUrl = await imageService.resizeAndUploadImage(file);

      res.json({ result: 'success', url: resizedImageUrl });
    } catch (error) {
      console.log(error)
      res.status(500).json({ result: 'error', error: error });
    }
  }



  //TODO GET 이미지

  //TODO GET 이미지들

}

export default new ImageController();