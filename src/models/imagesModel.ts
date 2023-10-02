import { Schema, Document, model } from 'mongoose';

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
