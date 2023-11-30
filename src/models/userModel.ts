import { Schema, Document, model } from 'mongoose';
import {
  Gender,
  Location,
  Interest,
  Purpose,
  INTEREST_LIST,
  GENDER_LIST,
  LOCATION_LIST,
  PURPOSE_LIST,
} from '../constants';
import { CommonModel } from './commonModel';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: f2804e89-455e-4fb1-b7cb-a5aa1865ea5f
 *           description: 유저 ID.
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTc1ODQyYS1jYTQwLTQ1NGYtYTc1Mi04ZDFkMmVlYjc1ZDgiLCJpc3MiOiJIQVpFIiwiaWF0IjoxNjk2MjU3ODg2LCJleHAiOjE2OTYyNTk2ODZ9.jVu4mcGi2A1-L3z7XKxIDs8At33y-zFJE7Nu0kmW2aQ
 *           description: 리프레시 토큰.
 *         gender:
 *           $ref: '#/components/schemas/Gender'
 *         nickname:
 *           type: string
 *           example: 파란하늘은여덟
 *           description: 닉네임.
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         purpose:
 *           $ref: '#/components/schemas/Purpose'
 *         interests:
 *           $ref: '#/components/schemas/Interests'
 *         bans:
 *           type: array
 *           items:
 *             type: string
 *           example: ['f2804e89-455e-4fb1-b7cb-a5aa1865ea5f', 'f2804e89-455e-4fb1-b7cb-a5aa1865ea5f']
 *           description: 차단한 유저 ID 목록.
 *         reported:
 *           type: integer
 *           example: 5
 *           description: 신고 횟수.
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
export type User = {
  readonly id: string;

  readonly nickname: string;

  readonly refreshToken: string;

  readonly gender: Gender;

  readonly birth: string;

  readonly location: Location[];

  readonly interests: Interest[];

  readonly purpose: Purpose;

  readonly bans: string[];

  readonly reported: number;
} & CommonModel;

// for mongoose
const UserSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: GENDER_LIST,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    birth: {
      type: String,
      required: true,
    },
    location: {
      type: [
        {
          type: String,
          enum: LOCATION_LIST,
        },
      ],
      required: true,
    },
    purpose: {
      type: String,
      enum: PURPOSE_LIST,
      required: true,
    },
    interests: {
      type: [{ type: String, enum: INTEREST_LIST }],
      required: true,
    },
    bans: {
      type: [{ type: String }],
      required: true,
    },
    reported: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// for mongoose

export interface UserDocument extends Document {
  id: string;
  socketId: string;
  refreshToken: string;
  gender: Gender;
  nickname: string;
  birth: string;
  location: Location[];
  purpose: Purpose;
  interests: Interest[];
  bans: string[];
  reported: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserModel = model<UserDocument>('User', UserSchema);
