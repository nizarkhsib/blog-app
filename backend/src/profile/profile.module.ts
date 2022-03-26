import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { WinstonModule, } from 'nest-winston';
import { AppLogger } from '../core/services/logger.service';
import { ProfileController } from './profile.controller';
import { ProfileSchema } from './profile.model';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/profile',
    }),
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
    WinstonModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService, AppLogger],
})
export class ProfileModule { }
