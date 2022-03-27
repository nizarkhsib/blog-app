import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { AppLogger } from '../core/services/logger.service';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/user.model';
import { Profile } from './profile.model';

@Injectable()
export class ProfileService implements OnModuleInit {
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
    @InjectModel('Profile') private readonly userModel: Model<User>,
    private appLogger: AppLogger
  ) { }

  onModuleInit() {
    console.log(`The module has been initialized.`);
  }

  async getProfile(): Promise<Profile[]> {
    this.appLogger.warn(' getProfile ')
    this.appLogger.error(' getProfile ', 'test')
    this.appLogger.log(' getProfile ')
    return await this.profileModel.find();
  }

  async getProfileByArticleId(
    articleId: string,
    documentsToSkip = 0,
    limitOfDocuments?: number) {

    this.appLogger.warn(' getProfile ');
    this.appLogger.error(' getProfile ', 'test');
    this.appLogger.log(' getProfile ');

    const id = mongoose.Types.ObjectId(articleId);

    const findQuery = this.profileModel
      .find({ article: id })
      .sort([['updatedAt', 'descending']])
      // .sort({ _id: 1 })
      .skip(documentsToSkip)
      .populate('author', ['firstname', 'lastname']);

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }
    const results = await findQuery;
    const count = await this.profileModel.countDocuments({ article: id });

    return { results, count };
  }

  async findAll(documentsToSkip = 0, limitOfDocuments?: number) {
    const findQuery = this.profileModel
      .find()
      .sort([['updatedAt', 'descending']])
      // .sort({ _id: 1 })
      .skip(documentsToSkip);

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }
    const results = await findQuery;
    const count = await this.profileModel.count();

    return { results, count };
  }

  async getProfileByUserId(userId: string): Promise<Profile> {

    const id = mongoose.Types.ObjectId(userId);

    return await this.profileModel.findOne({ user: id })
      .populate('user', ['firstname', 'lastname', 'email']);
  }

  async updateProfile(profileId: string, Profile: Partial<Profile>): Promise<Profile> {
    return this.profileModel.findByIdAndUpdate({ _id: profileId }, Profile, { new: true });
  }

  async deleteProfile(prodId: string): Promise<void> {
    return await this.profileModel.deleteOne({ _id: prodId })
  }

}
function documentsToSkip(documentsToSkip: any) {
  throw new Error('Function not implemented.');
}

