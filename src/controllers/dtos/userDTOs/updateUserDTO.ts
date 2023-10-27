import { Interest, Location, Purpose } from '../../../constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDTO:
 *       type: object
 *       properties:
 *         purpose:
 *           $ref: '#/components/schemas/Purpose'
 *         interests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Interest'
 *           description: 사용자의 관심사 목록.
 *           example: ['여행','치맥']
 *         location:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Location'
 *           description: 사용자의 위치 목록.
 *           example: ['서울', '경기']
 *         birth:
 *           type: string
 *           description: 사용자의 생년월일.
 *           example: '1999-01-01'
 *         nickname:
 *           type: string
 *           description: 사용자의 닉네임.
 *           example: '사용자닉네임'
 */
export interface UpdateUserDTO {
  readonly id: string; // userId on payload for JWT

  readonly nickname: string; // 닉네임

  readonly location: Location[]; // 위치

  readonly birth: string; // 생년월일

  readonly purpose: Purpose; // 만남목적

  readonly interests: Interest[]; // 관심사목록
}
