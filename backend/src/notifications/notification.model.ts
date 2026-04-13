import { Document, Schema, SchemaTypes, Types } from 'mongoose';

export const NotificationSchema = new Schema({
  recipient: { type: SchemaTypes.ObjectId, ref: 'User', required: true },
  sender: { type: SchemaTypes.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['like', 'comment', 'comment_on_commented'],
    required: true
  },
  article: { type: SchemaTypes.ObjectId, ref: 'Article', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export interface Notification extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'like' | 'comment' | 'comment_on_commented';
  article: Types.ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
