import { Exception } from '../exception';

/**
 * @swagger
 * components:
 *   schemas:
 *     InvalidNicknameException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: InvalidNicknameException
 *           description: 예외명
 *         code:
 *           type: integer
 *           example: 1
 *           description: 예외 코드
 *         message:
 *           type: string
 *           example: 'nickname은 8자 이하 영어,숫자,한글만 허용됩니다.'
 *           description: 예외 메시지
 */
export class InvalidNicknameException extends Exception {
  constructor() {
    super({
      code: 1,
      message: 'nickname은 8자 이하 영어,숫자,한글만 허용됩니다.',
      name: 'InvalidNicknameException',
    });
  }
}
