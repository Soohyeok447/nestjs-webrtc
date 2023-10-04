import { Schema, Document, model } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Images:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 이미지 소유자의 사용자 ID.
 *         keys:
 *           type: array
 *           items:
 *             type: string
 *           description: 이미지 키 목록.
 *         urls:
 *           type: array
 *           items:
 *             type: string
 *           description: 이미지 URL 목록.
 */
export interface Images {
  //userId
  readonly userId: string;

  //image keys
  readonly keys: string[];

  //image urls
  readonly urls: string[];

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

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
