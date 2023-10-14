/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponseModel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: f2804e89-455e-4fb1-b7cb-a5aa1865ea5f
 *           description: 유저 ID.
 *         socketId:
 *           type: string
 *           example: f2804e89-455e-4fb1-b7cb-a5aa1865ea5f
 *           description: 소켓 ID.
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         nickname:
 *           type: string
 *           example: 파란하늘은여덟
 *           description: 닉네임.
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         purpose:
 *           $ref: '#/components/schemas/Purpose'
 *         interests:
 *           $ref: '#/components/schemas/Interests'
 *         bans:
 *           type: array
 *           items:
 *             type: string
 *           example: ['f2804e89-455e-4fb1-b7cb-a5aa1865ea5f', 'f2804e89-455e-4fb1-b7cb-a5aa1865ea5f']
 *           description: 차단한 유저 ID 목록.
 *         reported:
 *           type: integer
 *           example: 5
 *           description: 신고 횟수.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-04T18:50:48.894Z
 *           description: 생성 일자.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-04T18:50:48.894Z
 *           description: 업데이트 일자.
 */
import { User } from './userModel';

export type UserResponseModel = Omit<User, 'refreshToken'>;
