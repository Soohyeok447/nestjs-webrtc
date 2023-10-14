/**
 * @swagger
 * components:
 *   schemas:
 *     RenewTokenDTO:
 *       type: object
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: 리프레시 토큰.
 *         userId:
 *           type: string
 *           description: 토큰 페이로드의 userId.
 */
export interface RenewTokenDTO {
  readonly refreshToken: string;

  readonly userId: string;
}
