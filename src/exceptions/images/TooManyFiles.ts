import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   schemas:
 *     TooManyFilesException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: TooManyFilesException
 *           description: exception명
 *         code:
 *           type: integer
 *           example: 4
 *           description: 예외 코드.
 *         message:
 *           type: string
 *           example: '제공된 파일이 제한보다 많습니다.'
 *           description: 예외 메시지.
 */
export class TooManyFilesException extends Exception {
  constructor() {
    super({ code: 4, message: '제공된 파일이 제한보다 많습니다.', name: 'TooManyFilesException' });
  }
}