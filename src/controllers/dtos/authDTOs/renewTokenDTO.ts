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
 */
export interface RenewTokenDTO {
  readonly refreshToken: string;
}