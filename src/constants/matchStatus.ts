export const MATCHSTATUS_LIST = [
  'pending',
  'declined',
  'expired',
  'matched',
  'reported',
  'canceled',
  'completed',
] as const;

/**
 * @swagger
 * components:
 *   schemas:
 *     MatchStatus:
 *      type: string
 *      enum:
 *        - 'pending'
 *        - 'declined'
 *        - 'expired'
 *        - 'matched'
 *        - 'reported'
 *        - 'canceled'
 *        - 'completed'
 *      description: 매치의 상태.
 *      example: 'declined'
 */
export type MatchStatus = (typeof MATCHSTATUS_LIST)[number];
