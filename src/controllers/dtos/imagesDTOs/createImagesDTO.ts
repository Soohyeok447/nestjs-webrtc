/* eslint-disable prettier/prettier */
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateImagesDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 사용자 ID.
 *         files:
 *           type: file[]
 *           description: 이미지 파일들.
 */
export interface CreateImagesDTO {
  readonly userId: string;
  readonly files: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
}
