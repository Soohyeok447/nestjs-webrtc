/**
 * @swagger
 * components:
 *   schemas:
 *     SignInDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: accessToken 페이로드 속 userId.
 */
export interface SignInDTO {
  readonly userId: string;
}
