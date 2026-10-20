import * as mongoose from 'mongoose';
import { Document, Schema, SchemaTypes } from 'mongoose';
import { User } from '../auth/user.model';

export const ProfileSchema = new Schema({
  description: { type: String, default: '' },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  articlesCount: { type: Number, default: 0 },
  photoPath: { type: String, default: '' },
  profilePhoto:
  {
    data: Buffer,
    contentType: String
  },
  followers: [{ type: SchemaTypes.ObjectId, ref: 'User', required: false, default: [] }],
  following: [{ type: SchemaTypes.ObjectId, ref: 'User', required: false, default: [] }],
  user: { type: SchemaTypes.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export interface Profile extends Document {
  description: string;
  followersCount: number;
  followingCount: number;
  articlesCount: number;
  photoPath: string;
  profilePhoto?: { data: Buffer; contentType: string };
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
}