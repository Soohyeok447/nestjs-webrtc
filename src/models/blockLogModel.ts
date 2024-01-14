import { Schema, Document, model } from 'mongoose';
import { CommonModel } from './commonModel';

/**
 * @swagger
 * components:
 *   schemas:
 *     BlockLog:
 *       type: object
 *       description: 차단
 *       properties:
 *         userId:
 *           type: string
 *           example: f2804e89-455e-4fb1-b7cb-a5aa1865ea5f
 *           description: 유저의 id.
 *         blockUserIds:
 *           type: string[]
 *           example: ['f2804e89-455e-4fb1-b7cb-a5aa1865ea5f','f2804e89-455e-4fb1-b7cb-a5aa1865ea5f']
 *           description: 차단한 유저의 id들.
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
export type BlockLog = {
  readonly userId: string;

  readonly blockUserIds: string[];
} & CommonModel;

// for mongoose
const BlockLogSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    blockUserIds: {
      type: Array<string>,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// for mongoose
export interface BlockLogDocument extends Document {
  userId: string;
  blockUserIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const BlockLogModel = model<BlockLogDocument>(
  'BlockLog',
  BlockLogSchema,
);
