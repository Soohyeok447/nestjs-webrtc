import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   exceptions:
 *     OnlyOneImageAllowedException:
 *       code: 3
 *       message: 이미 생성한 이미지가 존재합니다.
 */
export class OnlyOneImageAllowedException extends Exception {
  constructor() {
    super({ code: 3, message: '이미 생성한 이미지가 존재합니다.' });
  }
}