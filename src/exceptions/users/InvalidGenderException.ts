import { Exception } from '../exception';

/**
 * @swagger
 * components:
 *   schemas:
 *     InvalidGenderException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: InvalidGenderException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 2
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: 'gender는 MALE 또는 FEMALE이어야 합니다.'
 *           description: 예외 메시지
 */

export class InvalidGenderException extends Exception {
  constructor() {
    super({
      code: 2,
      message: 'gender는 MALE 또는 FEMALE이어야 합니다.',
      name: 'InvalidGenderException',
    });
  }
}
