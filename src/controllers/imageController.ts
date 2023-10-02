import { Request, Response } from 'express';
import ImageService from '../services/imageService';
import { Images } from '../models/imagesModel';
import { CreateImagesDTO } from './dtos/imageDTOs/createImagesDTO';

class ImageController {
  //이미지 여러장 업로드
  public async createImages(req: Request, res: Response): Promise<void> {
    try {
      const createImagesDto: CreateImagesDTO = {
        userId: req.userId,
        files: req.files
      }

      const createdImages: Images = await ImageService.createImages(createImagesDto)

      res.status(201).json({
        id: createdImages.id,
        userId: createdImages.userId,
        urls: createdImages.urls
      });
    } catch (error) {
      console.log(error)

      res.status(500).json({ error: error });
    }
  }

  //TODO GET 이미지

  //TODO GET 이미지들

}

export default new ImageController();