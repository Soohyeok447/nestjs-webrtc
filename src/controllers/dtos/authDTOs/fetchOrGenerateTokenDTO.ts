/**
 * @swagger
 * components:
 *   schemas:
 *     FetchOrGenerateTokenDTO:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: 액세스 토큰.
 */
export interface FetchOrGenerateTokenDTO {
  readonly accessToken: string;
}