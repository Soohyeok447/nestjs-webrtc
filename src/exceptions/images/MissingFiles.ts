import { Exception } from "../exception";

/**
 * @swagger
 * components:
 *   exceptions:
 *     MissingFilesException:
 *       code: 2
 *       message: '파일이 제공되지 않았습니다.'
 */
export class MissingFilesException extends Exception {
  constructor() {
    super({ code: 2, message: '파일이 제공되지 않았습니다.' });
  }
}