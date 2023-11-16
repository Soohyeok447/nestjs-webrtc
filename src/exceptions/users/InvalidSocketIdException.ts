import { Exception } from '../exception';

/**
 * @swagger
 * components:
 *   schemas:
 *     InvalidSocketIdException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: InvalidSocketIdException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 7
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: 'socketId가 있어야합니다.'
 *           description: 예외 메시지
 */

export class InvalidSocketIdException extends Exception {
  constructor() {
    super({
      code: 7,
      message: 'socketId가 있어야합니다.',
      name: 'InvalidSocketIdException',
    });
  }
}
