import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { MulterModule } from '@nestjs/platform-express';
import { AppLogger } from '../core/services/logger.service';
import { ArticleSchema } from './article.model';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
    NotificationsModule
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, AppLogger],
})
export class ArticlesModule { }
