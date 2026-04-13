
import { Document, Schema, SchemaTypes, Types } from 'mongoose';
import * as mongoose from 'mongoose';

export const ArticleSchema = new Schema({
  title: { 
    type: String,
    required: true 
  },
  description: { 
    type: String,
    default: ''
  },
  content: { 
    type: String,
    default: ''
  },
  chapters: [{
    id: String,
    title: String,
    content: String,
    order: Number
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  archived: {
    type: Boolean,
    default: false
  },
  datePublished: { 
    type: Date,
    default: null
  },
  userId: { 
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true 
  },
  author: { 
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true 
  },
  authorName: {
    type: String,
    required: false
  },
  coverImage: {
    data: Buffer,
    contentType: String,
  },
  tags: { 
    type: [String],
    default: [] 
  },
  likes: { 
    type: Number,
    default: 0
  },
  likedBy: [{ type: SchemaTypes.ObjectId, ref: 'User', default: [] }],
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

ArticleSchema.index(
  { title: 'text', description: 'text', content: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 3, content: 1 } }
);

export interface Article extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  content: string;
  chapters: Array<{
    id: string;
    title: string;
    content: string;
    order: number;
  }>;
  status: 'draft' | 'published';
  archived: boolean;
  datePublished: Date;
  userId: string;
  author: string;
  authorName: string;
  coverImage: {
    data: Buffer;
    contentType: string;
  } | null;
  tags: string[];
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
