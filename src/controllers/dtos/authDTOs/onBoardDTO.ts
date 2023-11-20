import { Gender, Interest, Location, Purpose } from '../../../constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     OnBoardDTO:
 *       type: object
 *       properties:
 *         socketId:
 *           type: string
 *           description: socketId.
 *           example: 'q5d-8PzKUCCY7Kj6SAAAF'
 *         purpose:
 *           $ref: '#/components/schemas/Purpose'
 *         interests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Interest'
 *           description: 사용자의 관심사 목록.
 *           example: ['여행', '독서']
 *         location:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Location'
 *           description: 사용자의 위치 목록.
 *           example: ['경기', '서울']
 *         birth:
 *           type: string
 *           description: 사용자의 생년월일.
 *           example: '1999-01-01'
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         nickname:
 *           type: string
 *           description: 사용자의 닉네임.
 *           example: '사용자닉네임'
 */
export interface OnBoardDTO {
  readonly socketId: string; // socketId

  readonly gender: Gender; // 성별

  readonly nickname: string; // 닉네임

  readonly location: Location[]; // 위치

  readonly birth: string; // 생년월일

  readonly purpose: Purpose; // 만남목적

  readonly interests: Interest[]; // 관심사목록
}
