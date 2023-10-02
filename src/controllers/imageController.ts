import { Request, Response } from 'express';
import ImageService from '../services/imageService';
import { Images } from '../models/imagesModel';
import { CreateImagesDTO } from './dtos/imageDTOs/createImagesDTO';
import { UpdateImagesDTO } from './dtos/imageDTOs/updateImagesDTO';
import { FindImagesDTO } from './dtos/imageDTOs/findImagesDTO';

class ImageController {
  //이미지 여러장 업로드
  public async createImages(req: Request, res: Response) {
    try {
      const createImagesDto: CreateImagesDTO = {
        userId: req.userId,
        files: req.files
      }

      const createdImages: Images = await ImageService.createImages(createImagesDto)

      res.status(201).json({
        userId: createdImages.userId,
        keys: createdImages.keys,
        urls: createdImages.urls,
        createdAt: createdImages.createdAt,
        updatedAt: createdImages.updatedAt
      });
    } catch (error) {
      if (error.code === 2) {
        return res.status(400).json({ ...error });
      }

      if (error.code === 3) {
        return res.status(409).json({ ...error });
      }

      res.status(500).json({ ...error });
    }
  }

  //이미지 여러장 수정
  public async updateImages(req: Request, res: Response) {
    try {
      const updateImagesDTO: UpdateImagesDTO = {
        userId: req.userId,
        files: req.files
      }

      const updatedImages: Images = await ImageService.updateImages(updateImagesDTO)

      res.status(201).json({
        userId: updatedImages.userId,
        keys: updatedImages.keys,
        urls: updatedImages.urls,
        createdAt: updatedImages.createdAt,
        updatedAt: updatedImages.updatedAt
      });
    } catch (error) {
      if (error.code === 1) {
        return res.status(404).json({ ...error });
      }

      if (error.code === 2) {
        return res.status(400).json({ ...error });
      }

      return res.status(500).json({ ...error });
    }
  }

  //내 이미지 찾기
  public async findMyImages(req: Request, res: Response) {
    try {
      const findImagesDTO: FindImagesDTO = {
        userId: req.userId
      }

      const images: Images = await ImageService.findImages(findImagesDTO)

      res.status(201).json({
        userId: images.userId,
        keys: images.keys,
        urls: images.urls,
        createdAt: images.createdAt,
        updatedAt: images.updatedAt
      });
    } catch (error) {
      if (error.code === 1) {
        return res.status(404).json({ ...error });
      }

      return res.status(500).json({ ...error });
    }
  }

  //동적 파라미터 userId로 이미지 찾기
  public async findImages(req: Request, res: Response) {
    try {
      const findImagesDTO: FindImagesDTO = {
        userId: req.params.userId
      }

      const images: Images = await ImageService.findImages(findImagesDTO)

      res.status(201).json({
        userId: images.userId,
        keys: images.keys,
        urls: images.urls,
        createdAt: images.createdAt,
        updatedAt: images.updatedAt
      });
    } catch (error) {
      if (error.code === 1) {
        return res.status(404).json({ ...error });
      }

      return res.status(500).json({ ...error });
    }
  }

}

export default new ImageController();