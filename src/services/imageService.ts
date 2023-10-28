import sharp from 'sharp';
import storage from '../config/storage';
import { CreateImagesDTO } from '../controllers/dtos/imagesDTOs/createImagesDTO';
import { Images } from '../models/imagesModel';
import ImageRepository from '../repositories/imageRepository';
import UUIDService from './uuidService';
import { UpdateImagesDTO } from '../controllers/dtos/imagesDTOs/updateImagesDTO';
import { NotFoundImagesException } from '../exceptions/images/NotFoundImages';
import { MissingFilesException } from '../exceptions/images/MissingFiles';
import { OnlyOneImageAllowedException } from '../exceptions/images/OnlyOneImageObjectAllowed';
import { FindImagesDTO } from '../controllers/dtos/imagesDTOs/findImagesDTO';
import { TooManyFilesException } from '../exceptions/images/TooManyFiles';

const FILES_LENGTH = 5; //파일 갯수 제한

class ImageService {
  /**
   * 이미지 여러장을 리사이징해서 스토리지에 저장하고
   * db에 메타데이터를 저장한 뒤, 메타데이터 리턴
   */
  public async createImages({
    userId,
    files,
  }: CreateImagesDTO): Promise<Images> {
    try {
      //userId로 찾고 있으면 409
      const images = await ImageRepository.findByUserId(userId);

      if (images) throw new OnlyOneImageAllowedException();

      //파일이 제공되지 않았으면 400
      if (!files.length) throw new MissingFilesException();

      //파일이 FILES_LENGTH보다 많으면 400
      if ((files.length as number) > FILES_LENGTH)
        throw new TooManyFilesException();

      const resizedImagesBuffer: Buffer[] = await Promise.all(
        (files as Express.Multer.File[]).map(this._resizeImage),
      );

      const imageKeyAndUrls: { key: string; url: string }[] = await Promise.all(
        resizedImagesBuffer.map((buffer) => {
          const key = UUIDService.generateUUID();

          return this._uploadImageToStorage(buffer, key);
        }),
      );

      const keys = imageKeyAndUrls.map((item) => item.key);
      const urls = imageKeyAndUrls.map((item) => item.url);

      const createdImage: Images = await this._createImageInfo({
        userId,
        keys,
        urls,
      });

      return createdImage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 이미지 수정
   */
  public async updateImages({
    userId,
    files,
  }: UpdateImagesDTO): Promise<Images> {
    try {
      if (!files.length) throw new MissingFilesException();

      //파일이 FILES_LENGTH보다 많으면 400
      if ((files.length as number) > FILES_LENGTH)
        throw new TooManyFilesException();

      //userId로 이미지 메타데이터 찾아
      const images: Images = await ImageRepository.findByUserId(userId);

      //없으면 404
      if (!images) throw new NotFoundImagesException();

      const { keys } = images;

      //있으면 기존 이미지들 삭제하고
      await this._purgeStorageImages(keys);

      //새로 리사이징해서 올리고
      const resizedImagesBuffer: Buffer[] = await Promise.all(
        (files as Express.Multer.File[]).map(this._resizeImage),
      );

      const imageKeyAndUrls: { key: string; url: string }[] = await Promise.all(
        resizedImagesBuffer.map((buffer) => {
          const key = UUIDService.generateUUID();

          return this._uploadImageToStorage(buffer, key);
        }),
      );

      const newKeys = imageKeyAndUrls.map((item) => item.key);
      const newUrls = imageKeyAndUrls.map((item) => item.url);

      //메타데이터 업데이트
      const updatedImages: Images = await this._updateImageInfo({
        userId,
        keys: newKeys,
        urls: newUrls,
      });

      return updatedImages;
    } catch (error) {
      throw error;
    }
  }

  /**
   * userId로 이미지 찾기
   */
  public async findImages({ userId }: FindImagesDTO): Promise<Images> {
    try {
      //userId로 이미지 메타데이터 찾아
      const images: Images = await ImageRepository.findByUserId(userId);

      //없으면 404
      if (!images) throw new NotFoundImagesException();

      return images;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 이미지 메타데이터 저장
   */
  private async _createImageInfo({ userId, keys, urls }): Promise<Images> {
    const createdImage: Images = await ImageRepository.create({
      userId,
      keys,
      urls,
    });

    return createdImage;
  }

  /**
   * 이미지 메타데이터 수정
   */
  private async _updateImageInfo({ userId, keys, urls }): Promise<Images> {
    const updatedImages: Images = await ImageRepository.update({
      userId,
      keys,
      urls,
    });

    return updatedImages;
  }

  /**
   * 이미지 리사이징
   */
  private async _resizeImage(file: Express.Multer.File): Promise<Buffer> {
    return await sharp(file.buffer).resize({ height: 800 }).toBuffer();
  }

  /**
   * storage에 업로드하고 이미지가 저장된 url을 return
   */
  private async _uploadImageToStorage(
    buffer: Buffer,
    key: string,
  ): Promise<{
    url: string;
    key: string;
  }> {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `resized/${key}`,
      Body: buffer,
      ContentType: 'image',
      ACL: 'public-read',
    };

    try {
      await storage.putObject(params).promise();
    } catch (error) {
      throw { message: '이미지를 업로드하지 못했습니다.', ...error };
    }

    return {
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/resized/${key}`,
      key,
    };
  }

  /**
   * storage에 저장된 이미지들 삭제
   */
  private async _purgeStorageImages(keys: string[]): Promise<void> {
    await Promise.all(
      keys.map((key) => {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `resized/${key}`,
        };

        try {
          storage.deleteObject(params).promise();
        } catch (error) {
          console.log(error);

          throw {
            message: 'storage에 있는 이미지 삭제 실패했습니다.',
            error: error.toString(),
          };
        }
      }),
    );
  }
}

export default new ImageService();
