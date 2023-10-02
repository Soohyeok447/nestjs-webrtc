import sharp from "sharp";
import storage from "../config/storage";
import { CreateImagesDTO } from "../controllers/dtos/imageDTOs/createImagesDTO";
import { Images } from "../models/imagesModel";
import imageRepository from "../repositories/imageRepository";
import UUIDService from "./uuidService";

class ImageService {
  //이미지 여러장 업로드
  public async createImages({ userId, files }: CreateImagesDTO): Promise<Images> {
    try {
      const resizedImageUrls: string[] = await Promise.all(
        (files as Express.Multer.File[]).map(this.resizeAndUploadImage)
      );

      const createdImage: Images = await imageRepository.create({
        id: UUIDService.generateUUID(),
        userId,
        urls: resizedImageUrls
      })

      return createdImage
    } catch (error) {
      console.log(error)

      throw { message: '이미지 생성 실패' }
    }
  }

  public async resizeAndUploadImage(file: Express.Multer.File) {
    const resizedBuffer = await sharp(file.buffer)
      .resize({ height: 800 })
      .toBuffer();

    const key = UUIDService.generateUUID();

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `resized/${key}`,
      Body: resizedBuffer,
      ContentType: 'image',
      ACL: 'public-read',
    };

    await storage.putObject(params).promise();

    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/resized/${key}`;
  };
}

export default new ImageService();

