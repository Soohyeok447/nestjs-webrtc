import { Schema, Document, model } from 'mongoose';
import { CommonModel } from './commonModel';

export type Log = {
  readonly content: string;
} & CommonModel;

// for mongoose
const LogSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// for mongoose
export interface LogDocument extends Document {
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const LogModel = model<LogDocument>('Log', LogSchema);
