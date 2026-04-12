import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppLogger } from '../core/services/logger.service';
import { CommentSchema } from './comment.model';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }])
  ],
  controllers: [CommentsController],
  providers: [CommentsService, AppLogger],
})
export class CommentsModule { }
