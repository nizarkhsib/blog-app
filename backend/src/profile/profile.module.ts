import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UserSchema } from 'src/auth/user.model';
import { AppLogger } from '../core/services/logger.service';
import { ProfileController } from './profile.controller';
import { ProfileSchema } from './profile.model';
import { ProfileService } from './profile.service';
import { ArticleSchema } from 'src/articles/article.model';

@Module({
  imports: [
    MulterModule.register({
      dest: '/tmp/profile',
    }),
    MongooseModule.forFeature([
      { name: 'Profile', schema: ProfileSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Article', schema: ArticleSchema }
    ])
  ],
  controllers: [ProfileController],
  providers: [ProfileService, AppLogger],
})
export class ProfileModule { }
