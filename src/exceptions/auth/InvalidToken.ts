/**
 * @swagger
 * components:
 *   exceptions:
 *     InvalidTokenException:
 *       code: 1000
 *       message: '토큰이 만료되었거나 유효하지 않습니다.'
 */
export const InvalidTokenException = { code: 1000, message: '토큰이 만료되었거나 유효하지 않습니다.' };