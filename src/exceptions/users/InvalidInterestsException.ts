/**
 * @swagger
 * components:
 *   schemas:
 *     InvalidInterestsException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: InvalidInterestsException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 5
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: '관심사는 정해진 목록 중에서 3개 이하만 허용됩니다.'
 *           description: 예외 메시지
 */

import { Exception } from "../exception";

export class InvalidInterestsException extends Exception {
  constructor() {
    super({ code: 5, message: '관심사는 정해진 목록 중에서 3개 이하만 허용됩니다.', name: 'InvalidInterestsException' });
  }
}