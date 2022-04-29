
import { Document, Schema, SchemaTypes } from 'mongoose';

export const ArticleSchema = new Schema({
  title: { type: String },
  // description: { type: String },
  content: { type: String, },
  datePublished: { type: Date },
  userId: { type: String },
  filePath: { type: String },
  likes: { type: Number },
  author: { type: SchemaTypes.ObjectId, ref: 'User', required: false },
  tags: { type: Array<String>(), default: [] },
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
  tags: string[];
}
