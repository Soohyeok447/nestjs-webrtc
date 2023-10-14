/**
 * @swagger
 * components:
 *   schemas:
 *     InvalidPurposeException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: InvalidPurposeException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 6
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: '유효하지 않은 만남 purpose입니다.'
 *           description: 예외 메시지
 */

import { Exception } from '../exception';

export class InvalidPurposeException extends Exception {
  constructor() {
    super({
      code: 6,
      message: '유효하지 않은 purpose입니다.',
      name: 'InvalidPurposeException',
    });
  }
}
