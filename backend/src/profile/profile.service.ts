import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppLogger } from '../core/services/logger.service';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/user.model';
import { Profile } from './profile.model';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService implements OnModuleInit {

  private readonly populateUser = ['firstname', 'lastname', 'email'];

  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
    @InjectModel('User') private readonly userModel: Model<User>,
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
      .populate('user', this.populateUser);
  }

  async updateProfile(profileId: string, file, profileDto: ProfileDto): Promise<Profile> {
    try {

      const profileModel = await this.profileModel.findByIdAndUpdate(
        { _id: profileId },
        {
          photoPath: file.path
        },
        { useFindAndModify: false, new: true }
      );

      const x = await this.userModel.findByIdAndUpdate(
        { _id: profileModel.user },
        {
          'firstname': profileDto.firstname,
          'lastname': profileDto.lastname,
        }
        // @TODO later 
        //implement email edit ('email': profileDto.email)
        ,
        { useFindAndModify: false }
      );

      return await profileModel.populate('user', this.populateUser).execPopulate();

    } catch (error) {
      console.log('error', error);
    }

  }

  async deleteProfile(prodId: string): Promise<void> {
    return await this.profileModel.deleteOne({ _id: prodId })
  }

}
function documentsToSkip(documentsToSkip: any) {
  throw new Error('Function not implemented.');
}

