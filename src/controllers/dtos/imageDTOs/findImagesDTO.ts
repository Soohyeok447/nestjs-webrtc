/**
 * @swagger
 * components:
 *   schemas:
 *     FindImagesDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 검색할 사용자 ID.
 */
export interface FindImagesDTO {
  readonly userId: string;
}