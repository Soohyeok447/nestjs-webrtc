import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   schemas:
 *     NotFoundImagesException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: NotFoundImagesException
 *           description: exception명
 *         code:
 *           type: integer
 *           example: 1
 *           description: 예외 코드.
 *         message:
 *           type: string
 *           example: '이미지를 찾을 수 없습니다.'
 *           description: 예외 메시지.
 */
export class NotFoundImagesException extends Exception {
  constructor() {
    super({ code: 1, message: '이미지를 찾을 수 없습니다.', name: 'NotFoundImagesException' });
  }
}