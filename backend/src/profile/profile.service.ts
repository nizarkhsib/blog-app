import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLogger } from '../core/services/logger.service';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/user.model';
import { Profile } from './profile.model';
import { ProfileDto } from './dto/profile.dto';
import { Article } from 'src/articles/article.model';

@Injectable()
export class ProfileService implements OnModuleInit {

  private readonly populateUser = ['firstname', 'lastname', 'email'];

  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Article') private readonly articleModel: Model<Article>,
    private appLogger: AppLogger
  ) { }

  onModuleInit() {
  }

  async getProfile(): Promise<Profile[]> {
    this.appLogger.warn(' getProfile ')
    this.appLogger.error(' getProfile ', 'test')
    this.appLogger.log(' getProfile ')
    return await this.profileModel.find();
  }

  async findAll(documentsToSkip = 0, limitOfDocuments?: number) {
    const findQuery = this.profileModel
      .find()
      .sort([['updatedAt', 'descending']])
      .skip(documentsToSkip);

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }
    const results = await findQuery;
    const count = await this.profileModel.countDocuments();

    return { results, count };
  }

  async getProfileByUserId(userId: string): Promise<Profile> {

    const id = new mongoose.Types.ObjectId(userId);

    const profile = await this.profileModel.findOne({ user: id })
      .populate('user', this.populateUser);

    if (profile) {
      // Calculate article count for this user
      const articlesCount = await this.articleModel.countDocuments({ userId: id });
      
      // Update the profile object with dynamic counts
      profile.articlesCount = articlesCount;
      profile.followersCount = profile.followers?.length || 0;
      profile.followingCount = profile.following?.length || 0;

      // Point photoPath to the binary endpoint if a blob is stored
      if (profile.profilePhoto?.data) {
        profile.photoPath = `Profile/${profile._id}/photo`;
      }
    }

    return profile;
  }

  async getProfileStats(userId: string): Promise<{ articlesCount: number; followersCount: number; followingCount: number }> {
    const id = new mongoose.Types.ObjectId(userId);

    const profile = await this.profileModel.findOne({ user: id });

    if (!profile) {
      return {
        articlesCount: 0,
        followersCount: 0,
        followingCount: 0
      };
    }

    // Calculate article count for this user
    const articlesCount = await this.articleModel.countDocuments({ userId: id });
    
    return {
      articlesCount: articlesCount,
      followersCount: profile.followers?.length || 0,
      followingCount: profile.following?.length || 0
    };
  }

  async isFollowing(userId: string, targetUserId: string): Promise<{ isFollowing: boolean }> {
    try {
      const loggedInId = new mongoose.Types.ObjectId(userId);
      const targetId = new mongoose.Types.ObjectId(targetUserId);

      const targetProfile = await this.profileModel.findOne({ user: targetId });

      if (!targetProfile) {
        return { isFollowing: false };
      }

      const isFollowing = targetProfile.followers?.some(follower => 
        follower.toString() === loggedInId.toString()
      );

      return { isFollowing: !!isFollowing };
    } catch (error) {
      return { isFollowing: false };
    }
  }

  async updateProfile(profileId: string, file: Express.Multer.File, profileDto: ProfileDto): Promise<Profile> {
    try {
      const updateData: Record<string, any> = {};

      if (file?.buffer) {
        updateData.profilePhoto = {
          data: file.buffer,
          contentType: file.mimetype,
        };
      }

      const profileModel = await this.profileModel.findByIdAndUpdate(
        { _id: profileId },
        updateData,
        { useFindAndModify: false, new: true }
      );

      await this.userModel.findByIdAndUpdate(
        { _id: profileModel.user },
        {
          'firstname': profileDto.firstname,
          'lastname': profileDto.lastname,
        },
        { useFindAndModify: false }
      );

      const populated = await profileModel.populate('user', this.populateUser);

      // Point photoPath to the binary endpoint
      if (populated.profilePhoto?.data) {
        populated.photoPath = `Profile/${populated._id}/photo`;
      }

      return populated;

    } catch (error) {
      throw error;
    }
  }

  async getProfilePhoto(profileId: string): Promise<{ data: Buffer; contentType: string } | null> {
    const profile = await this.profileModel.findById(profileId).select('profilePhoto');
    if (!profile?.profilePhoto?.data) return null;
    return { data: profile.profilePhoto.data as Buffer, contentType: profile.profilePhoto.contentType };
  }

  async deleteProfile(prodId: string): Promise<void> {
    await this.profileModel.deleteOne({ _id: prodId })
  }

  async followUser(loggedInUserId: string, targetUserId: string): Promise<{ message: string }> {
    try {
      const loggedInId = new mongoose.Types.ObjectId(loggedInUserId);
      const targetId = new mongoose.Types.ObjectId(targetUserId);

      // Add logged-in user to target user's followers (atomic operation)
      await this.profileModel.findOneAndUpdate(
        { user: targetId },
        { $addToSet: { followers: loggedInId } },
        { new: true }
      );

      // Add target user to logged-in user's following (atomic operation)
      await this.profileModel.findOneAndUpdate(
        { user: loggedInId },
        { $addToSet: { following: targetId } },
        { new: true }
      );

      return { message: 'Successfully followed user' };
    } catch (error) {
      throw new Error(`Failed to follow user: ${error.message}`);
    }
  }

  async unfollowUser(loggedInUserId: string, targetUserId: string): Promise<{ message: string }> {
    try {
      const loggedInId = new mongoose.Types.ObjectId(loggedInUserId);
      const targetId = new mongoose.Types.ObjectId(targetUserId);

      // Remove logged-in user from target user's followers (atomic operation)
      await this.profileModel.findOneAndUpdate(
        { user: targetId },
        { $pull: { followers: loggedInId } },
        { new: true }
      );

      // Remove target user from logged-in user's following (atomic operation)
      await this.profileModel.findOneAndUpdate(
        { user: loggedInId },
        { $pull: { following: targetId } },
        { new: true }
      );

      return { message: 'Successfully unfollowed user' };
    } catch (error) {
      throw new Error(`Failed to unfollow user: ${error.message}`);
    }
  }

}

