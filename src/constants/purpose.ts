/**
 * 진지한연애 - 1
 * 커피한잔 - 2
 * 캐쥬얼한 친구 - 3
 * 술 한잔 - 4
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Purpose:
 *       type: string
 *       enum:
 *         - '진지한연애'
 *         - '커피한잔'
 *         - '캐쥬얼한친구'
 *         - '술한잔'
 *       description: 사용 가능한 만남 목적.
 *       example: 술한잔
 */
export const PURPOSE_LIST = [
  '진지한연애',
  '커피한잔',
  '캐쥬얼한친구',
  '술한잔',
] as const;

export type Purpose = (typeof PURPOSE_LIST)[number];
