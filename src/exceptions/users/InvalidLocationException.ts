import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   schemas:
 *     InvalidLocationException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: InvalidLocationException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 4
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: 'location은 정해진 지역 중에서 3개 이하만 허용됩니다.'
 *           description: 예외 메시지
 */

export class InvalidLocationException extends Exception {
  constructor() {
    super({ code: 4, message: 'location은 정해진 지역중 3개 이하만 허용됩니다.', name: 'InvalidLocationException' });
  }
}
