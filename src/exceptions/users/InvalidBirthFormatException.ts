import { Exception } from '../exception';

/**
 * @swagger
 * components:
 *   schemas:
 *     InvalidBirthFormatException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: InvalidBirthFormatException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 3
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: 'birth는 YYYY-MM-DD 형식이어야 합니다.'
 *           description: 예외 메시지
 */

export class InvalidBirthFormatException extends Exception {
  constructor() {
    super({
      code: 3,
      message: 'birth는 YYYY-MM-DD 형식이어야 합니다.',
      name: 'InvalidBirthFormatException',
    });
  }
}
