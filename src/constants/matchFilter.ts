/**
 * @swagger
 * components:
 *   schemas:
 *     MatchFilter:
 *       type: object
 *       properties:
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         minAge:
 *           type: number
 *           description: 나이 최소값
 *           example: 25
 *         maxAge:
 *           type: number
 *           description: 나이 최대값
 *           example: 30
 */

import { Gender, Location } from '.';

export interface MatchFilter {
  readonly gender: Gender;
  readonly location: Location[];
  readonly minAge: number;
  readonly maxAge: number;
}
