import { Schema, Document, model } from 'mongoose';
import { CommonModel } from './commonModel';
import { MATCHSTATUS_LIST, MatchStatus } from '../constants';

/**
 * @swagger
 * components:
 *   schemas:
 *     MatchLog:
 *       type: object
 *       description: 매치 로그
 *       properties:
 *         id:
 *           type: string
 *           example: f2804e89-455e-4fb1-b7cb-a5aa1865ea5f
 *           description: 매치로그 ID.
 *         userIds:
 *           type: string[]
 *           example: ['f2804e89-455e-4fb1-b7cb-a5aa1865ea5f','f2804e89-455e-4fb1-b7cb-a5aa1865ea5f']
 *         status:
 *           $ref: '#/components/schemas/MatchStatus'
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
export type MatchLog = {
  readonly id: string;

  readonly userIds: string[];

  readonly status: MatchStatus;
} & CommonModel;

// for mongoose
const MatchLogSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userIds: {
      type: Array<string>,
      required: true,
    },
    status: {
      type: String,
      enum: MATCHSTATUS_LIST,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// for mongoose
export interface MatchLogDocument extends Document {
  id: string;
  userIds: string[];
  status: MatchStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export const MatchLogModel = model<MatchLogDocument>(
  'MatchLog',
  MatchLogSchema,
);
