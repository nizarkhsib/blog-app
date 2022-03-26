
import { Document, Schema } from 'mongoose';

export const ArticleSchema = new Schema({
  title: { type: String },
  // description: { type: String },
  content: { type: String, },
  datePublished: { type: Date },
  userId: { type: String },
  filePath: { type: String },
  likes: { type: Number },
  image:
  {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true });

export interface Article extends Document {
  _id: string;
  title: string;
  // description: string;
  content: string;
  datePublished: number;
  userId: string;
  filePath: string;
  image: File;
  likes: number;
}
