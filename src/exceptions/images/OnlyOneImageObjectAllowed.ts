import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   schemas:
 *     OnlyOneImageAllowedException:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: OnlyOneImageAllowedException
 *           description: exception명
 *         code:
 *           type: integer
 *           example: 3
 *           description: 예외 코드.
 *         message:
 *           type: string
 *           example: '이미 생성한 이미지가 존재합니다.'
 *           description: 예외 메시지.
 */
export class OnlyOneImageAllowedException extends Exception {
  constructor() {
    super({ code: 3, message: '이미 생성한 이미지가 존재합니다.', name: 'OnlyOneImageAllowedException' });
  }
}