import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppLogger } from '../core/services/logger.service';
import { CommentSchema } from './comment.model';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { ArticleSchema } from '../articles/article.model';

@Module({
  imports: [
    MulterModule.register({
      dest: '/tmp',
    }),
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'Article', schema: ArticleSchema }
    ]),
    NotificationsModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService, AppLogger],
})
export class CommentsModule { }
