import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   schemas:
 *     MissingTokenException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: MissingTokenException
 *           description: exception명
 *         code:
 *           type: integer
 *           example: 1001
 *           description: 예외 코드.
 *         message:
 *           type: string
 *           example: '토큰이 없습니다.'
 *           description: 예외 메시지.
 */
export class MissingTokenException extends Exception {
  constructor() {
    super({ code: 1001, message: '토큰이 없습니다.', name: 'MissingTokenException' });
  }
}