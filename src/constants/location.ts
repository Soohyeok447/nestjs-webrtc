export const LOCATION_LIST = ['서울', '경기'] as const;

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: array
 *       items:
 *         type: string
 *         enum:
 *           - '서울'
 *           - '경기'
 *       description: 사용 가능한 지역 목록.
 *       example: ['서울','경기']
 */
export type Location = (typeof LOCATION_LIST)[number][];
