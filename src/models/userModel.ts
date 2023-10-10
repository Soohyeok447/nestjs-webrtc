import { Schema, Document, model } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 유저 ID.
 *         socketId:
 *            type: string
 *            description: 소켓 ID
 *         refreshToken:
 *            type: string
 *            description: 리프레시 토큰
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 관심사 태그 목록.
 *         bans:
 *           type: array
 *           items:
 *             type: string
 *           description: 차단한 유저id 목록.
 */
export interface User {
  readonly id: string;

  readonly socketId: string;

  readonly refreshToken: string;

  readonly tags: string[];

  readonly bans: string[];

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

// for mongoose
export interface UserDocument extends Document {
  id: string;

  socketId: string;

  refreshToken: string;

  tags: string[];

  bans: string[];
}

// for mongoose
const UserSchema: Schema = new Schema({
  id: { type: String, required: true },
  socketId: { type: String, required: true },
  refreshToken: { type: String, required: true },
  tags: { type: Array<String>, required: true },
  bans: { type: Array<String>, required: true, },
}, {
  timestamps: true
});

export const UserModel = model<UserDocument>('User', UserSchema);
