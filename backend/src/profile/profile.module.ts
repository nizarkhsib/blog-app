import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { WinstonModule, } from 'nest-winston';
import { UserSchema } from 'src/auth/user.model';
import { AppLogger } from '../core/services/logger.service';
import { ProfileController } from './profile.controller';
import { ProfileSchema } from './profile.model';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/profile',
    }),
    MongooseModule.forFeature([
      { name: 'Profile', schema: ProfileSchema },
      { name: 'User', schema: UserSchema }
    ]),
    WinstonModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService, AppLogger],
})
export class ProfileModule { }
