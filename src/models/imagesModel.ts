import { Schema, Document, model } from 'mongoose';
import { CommonModel } from './commonModel';

/**
 * @swagger
 * components:
 *   schemas:
 *     Images:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: f2804e89-455e-4fb1-b7cb-a5aa1865ea5f
 *           description: 이미지 소유자의 사용자 ID.
 *         keys:
 *           type: array
 *           items:
 *             type: string
 *             example:
 *               - f2804e89-455e-4fb1-b7cb-a5aa1865ea5f
 *               - f2804e89-455e-4fb1-b7cb-a5aa1865ea5f
 *           description: 이미지 키 목록.
 *         urls:
 *           type: array
 *           items:
 *             type: string
 *             example:
 *               - https://haze-dev-8901.s3.ap-northeast-2.amazonaws.com/resized/11646720-85fd-4d45-bbdf-58d5f925cab5
 *               - https://haze-dev-8901.s3.ap-northeast-2.amazonaws.com/resized/11646720-85fd-4d45-bbdf-58d5f925cab5
 *           description: 이미지 URL 목록.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-04T18:50:48.894Z
 *           description: 이미지 생성 일자.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-10-04T18:50:48.894Z
 *           description: 이미지 업데이트 일자.
 */
export type Images = {
  readonly userId: string;

  readonly keys: string[];

  readonly urls: string[];

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
} & CommonModel

// for mongoose
export interface ImagesDocument extends Document {
  userId: string;

  keys: string[];

  urls: string[];
}

// for mongoose
const ImagesSchema: Schema = new Schema({
  userId: { type: String, required: true },
  keys: { type: Array<String>, required: true },
  urls: { type: Array<String>, required: true, },
}, {
  timestamps: true
});

export const ImagesModel = model<ImagesDocument>('Images', ImagesSchema);
