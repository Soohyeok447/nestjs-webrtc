/**
 * @swagger
 * components:
 *   schemas:
 *     BlockUserDTO:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 유저 id.
 *           example: 'f2804e89-455e-4fb1-b7cb-a5aa1865ea5f'
 *         targetId:
 *           type: string
 *           description: 차단할 사용자의 id.
 *           example: 'f2804e89-455e-4fb1-b7cb-a5aa1865ea5f'
 */
export interface BlockUserDTO {
  readonly userId: string; // 유저 id

  readonly targetId: string; //차단할 사용자의 id
}
