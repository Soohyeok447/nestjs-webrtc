/**
 * @swagger
 * components:
 *   schemas:
 *     NotFoundBlockLogException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: NotFoundBlockLogException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 1
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: '차단정보를 찾을 수 없습니다.'
 *           description: 예외 메시지
 */

import { Exception } from '../exception';

export class NotFoundBlockLogException extends Exception {
  constructor() {
    super({
      code: 1,
      message: '차단정보를 찾을 수 없습니다.',
      name: 'NotFoundBlockLogException',
    });
  }
}
