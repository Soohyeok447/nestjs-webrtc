import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   exceptions:
 *     TooManyFilesException:
 *       code: 4
 *       message: '제공된 파일이 제한보다 많습니다.'
 */
export class TooManyFilesException extends Exception {
  constructor() {
    super({ code: 4, message: '제공된 파일이 제한보다 많습니다.' });
  }
}