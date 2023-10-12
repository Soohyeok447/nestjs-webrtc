import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   schemas:
 *     InvalidTokenException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: InvalidTokenException
 *           description: exception명
 *         code:
 *           type: integer
 *           example: 1000
 *           description: 예외 코드.
 *         message:
 *           type: string
 *           example: '토큰이 유효하지 않습니다.'
 *           description: 예외 메시지.
 */
export class InvalidTokenException extends Exception {
  constructor() {
    super({ message: '토큰이 유효하지 않습니다.', code: 1000, name: 'InvalidTokenException' });
  }
}