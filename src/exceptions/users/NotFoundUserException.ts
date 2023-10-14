/**
 * @swagger
 * components:
 *   schemas:
 *     NotFoundUserException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: NotFoundUserException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 7
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: '유저를 찾을 수 없습니다.'
 *           description: 예외 메시지
 */

import { Exception } from '../exception';

export class NotFoundUserException extends Exception {
  constructor() {
    super({
      code: 7,
      message: '유저를 찾을 수 없습니다.',
      name: 'NotFoundUserException',
    });
  }
}
