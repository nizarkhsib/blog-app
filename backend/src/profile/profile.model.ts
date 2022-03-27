// import * as mongoose from 'mongoose';
import { Document, Schema, SchemaTypes } from 'mongoose';
import { User } from 'src/auth/user.model';

export const ProfileSchema = new Schema({
  description: { type: String, default: '' },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  articlesCount: { type: Number, default: 0 },
  photoPath: { type: String },
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
  description: { type: String, },
  followersCount: { type: Number },
  followingCount: { type: Number },
  articlesCount: { type: Number },
  photoPath: string;
  followers: Partial<User[]>;
  following: Partial<User[]>;
  user: Partial<User>;
}