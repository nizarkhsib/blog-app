import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { WinstonModule, } from 'nest-winston';
import { AppLogger } from '../core/services/logger.service';
import { CommentSchema } from './comment.model';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    WinstonModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService, AppLogger],
})
export class CommentsModule { }
