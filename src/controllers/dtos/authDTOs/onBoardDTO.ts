import { Gender, Interests, Location, Purpose } from '../../../constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     OnBoardDTO:
 *       type: object
 *       properties:
 *         purpose:
 *           $ref: '#/components/schemas/Purpose'
 *         interests:
 *           $ref: '#/components/schemas/Interests'
 *         location:
 *           $ref: '#/components/schemas/Location'
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
  readonly gender: Gender; // 성별

  readonly nickname: string; // 닉네임

  readonly location: Location; // 위치

  readonly birth: string; // 생년월일

  readonly purpose: Purpose; // 만남목적

  readonly interests: Interests; // 관심사목록
}
