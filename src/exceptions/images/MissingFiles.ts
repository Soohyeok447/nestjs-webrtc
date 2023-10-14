import { Exception } from '../exception';

/**
 * @swagger
 * components:
 *   schemas:
 *     MissingFilesException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: MissingFilesException
 *           description: exception명
 *         code:
 *           type: integer
 *           example: 2
 *           description: 예외 코드.
 *         message:
 *           type: string
 *           example: '파일이 제공되지 않았습니다.'
 *           description: 예외 메시지.
 */
export class MissingFilesException extends Exception {
  constructor() {
    super({
      code: 2,
      message: '파일이 제공되지 않았습니다.',
      name: 'MissingFilesException',
    });
  }
}
