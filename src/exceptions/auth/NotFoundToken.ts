import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   exceptions:
 *     NotFoundTokenException:
 *       code: 1001
 *       message: '토큰이 없습니다.'
 */
export class NotFoundTokenException extends Exception {
  constructor() {
    super({ code: 1001, message: '토큰이 없습니다.' });
  }
}