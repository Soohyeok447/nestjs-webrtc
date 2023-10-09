import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   exceptions:
 *     NotFoundImagesException:
 *       code: 1
 *       message: '이미지를 찾을 수 없습니다.'
 */
export class NotFoundImagesException extends Exception {
  constructor() {
    super({ code: 1, message: '이미지를 찾을 수 없습니다.' });
  }
}