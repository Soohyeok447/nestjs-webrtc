/**
 * @swagger
 * components:
 *   schemas:
 *     FetchOrGenerateTokenDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: accessToken 페이로드 속 userId.
 */
export interface FetchOrGenerateTokenDTO {
  readonly userId: string;
}