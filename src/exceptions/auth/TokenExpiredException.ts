import { Exception } from '../exception';

/**
 * @swagger
 * components:
 *   schemas:
 *     TokenExpiredException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: TokenExpiredException
 *           description: exception명
 *         code:
 *           type: integer
 *           example: 1002
 *           description: 예외 코드.
 *         message:
 *           type: string
 *           example: '토큰이 만료되습니다.'
 *           description: 예외 메시지.
 */
export class TokenExpiredException extends Exception {
  constructor() {
    super({
      message: '토큰이 만료되었습니다.',
      code: 1002,
      name: 'TokenExpiredException',
    });
  }
}
