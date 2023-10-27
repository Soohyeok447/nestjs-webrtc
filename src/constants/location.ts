export const LOCATION_LIST = ['서울', '경기'] as const;

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *      type: string
 *      enum:
 *        - '서울'
 *        - '경기'
 *      description: 지역.
 *      example: '서울'
 */
export type Location = (typeof LOCATION_LIST)[number];
