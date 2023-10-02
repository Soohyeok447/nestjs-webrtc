import { Schema, Document, model } from 'mongoose';

export interface Images {
  //imageId
  readonly id: string;

  //userId
  readonly userId: string;

  //image url
  readonly urls: string[];
}

// for mongoose
export interface ImagesDocument extends Document {
  readonly id: string;

  readonly userId: string;

  //image url
  readonly urls: string[];
}

// for mongoose
const ImagesSchema: Schema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  urls: { type: Array<String>, required: true, },
}, {
  timestamps: true
});

export const ImagesModel = model<ImagesDocument>('Images', ImagesSchema);
