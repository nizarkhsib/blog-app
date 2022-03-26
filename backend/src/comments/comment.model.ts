// import * as mongoose from 'mongoose';
import { Connection, Document, Model, Schema, SchemaTypes } from 'mongoose';
import { Article } from 'src/articles/article.model';
import { User } from 'src/auth/user.model';

export const CommentSchema = new Schema({
  content: { type: String, },
  // datePublished: { type: Date },
  likes: { type: Number },
  article: { type: SchemaTypes.ObjectId, ref: 'Article', required: false },
  author: { type: SchemaTypes.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

export interface Comment extends Document {
  content: string;
  // datePublished: Date;
  likes: number;
  article: Partial<Article>;
  author: Partial<User>;
}
