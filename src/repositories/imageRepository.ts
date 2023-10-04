import { Images, ImagesModel } from '../models/imagesModel';


/**
 * @swagger
 * components:
 *   schemas:
 *     Images:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         keys:
 *           type: array
 *           items:
 *             type: string
 *         urls:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *   exceptions:
 *     TooManyFilesException:
 *       code: 4
 *       message: '제공된 파일이 제한보다 많습니다.'
 *
 *     OnlyOneImageAllowedException:
 *       code: 3
 *       message: '이미 생성한 이미지가 존재합니다.'
 *
 *     MissingFilesException:
 *       code: 2
 *       message: '파일이 제공되지 않았습니다.'
 *
 *     NotFoundImagesException:
 *       code: 1
 *       message: '이미지를 찾을 수 없습니다.'
 *
 *   parameters:
 *     userIdPathParam:
 *       in: path
 *       name: userId
 *       required: true
 *       description: 사용자 ID
 *       schema:
 *         type: string
 *
 *   requestBody:
 *     CreateImagesDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         files:
 *           type: array
 *           items:
 *             type: file
 *
 *     UpdateImagesDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         files:
 *           type: array
 *           items:
 *             type: file
 *
 *   responses:
 *     ImagesResponse:
 *       description: 이미지 응답
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Images'
 */
class ImageRepository {
  public async create({ userId, keys, urls }: Images): Promise<Images> {
    const image = new ImagesModel({ userId, keys, urls });

    return await image.save();
  }

  public async findByUserId(userId: string): Promise<Images | null> {
    return await ImagesModel.findOne({ userId }).exec();
  }

  public async update({ userId, keys, urls }: Images): Promise<Images> {
    const images = await ImagesModel.findOne({ userId }).exec();

    images.urls = urls;
    images.keys = keys

    return await images.save();
  }
}

export default new ImageRepository();