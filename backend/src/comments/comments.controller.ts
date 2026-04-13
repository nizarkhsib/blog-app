import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Query, Req, BadRequestException } from '@nestjs/common';
import { Comment } from './comment.model';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable } from 'rxjs';
import { PaginationParams } from 'src/pagination-params';
import { CommentDto } from './dto/comment.dto';
import { CommentsService } from './comments.service';
import { Request } from 'express';
import { NotificationsService } from '../notifications/notifications.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../articles/article.model';

@Controller('Comments')
@ApiTags('Comment')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly notificationsService: NotificationsService,
    @InjectModel('Article') private readonly articleModel: Model<Article>,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'addComment' })
  @Post()
  async addComment(@Body() commentDto: CommentDto, @Req() req: Request) {
    const authUser = req.user['user'] || req.user;
    const authorId = authUser['id'] || authUser['_id'];
    if (!authorId) throw new BadRequestException('User not authenticated');
    const comment = await this.commentsService.addComment({ ...commentDto, authorId });
    const senderName = authUser['firstname'] || 'Someone';

    // Notify article author
    const article = await this.articleModel
      .findById(commentDto.articleId)
      .populate('author', ['firstname', 'lastname']);
    if (article) {
      const articleAuthorId = (article.author as any)?._id?.toString() || article.userId?.toString();
      this.notificationsService.create({
        recipient: articleAuthorId,
        sender: authorId,
        type: 'comment',
        article: commentDto.articleId,
        message: `${senderName} commented on your article "${article.title}"`,
      }).catch(() => {});

      // Notify other commenters on this article
      const otherCommenters = await this.commentsService.getDistinctCommenters(commentDto.articleId);
      for (const commenterId of otherCommenters) {
        const cid = commenterId.toString();
        // Skip the comment author and the article author (already notified)
        if (cid === authorId || cid === articleAuthorId) continue;
        this.notificationsService.create({
          recipient: cid,
          sender: authorId,
          type: 'comment_on_commented',
          article: commentDto.articleId,
          message: `${senderName} also commented on "${article.title}"`,
        }).catch(() => {});
      }
    }

    return comment;
  }

  @ApiOperation({ summary: 'getComments by article ID' })
  @Get(':id')
  async getCommentsByArticleId(
    @Param('id') articleId: string,
    @Query() { skip, limit }: PaginationParams) {
    return await this.commentsService.getCommentsByArticleId(articleId, Number(skip), Number(limit));
  }

  @ApiOperation({ summary: 'getPaginatedComments' })
  @Get()
  async getPaginatedComments(@Query() { skip, limit }: PaginationParams) {
    return this.commentsService.findAll(Number(skip), Number(limit));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'updateCategory' })
  @Put(':id')
  async updateCategory(@Param('id') CommentId: string, @Body() category: Comment): Promise<Comment> {
    return this.commentsService.updateComment(CommentId, category);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'removeComment' })
  @Delete(':id')
  async removeComment(@Param('id') CommentId: string) {
    await this.commentsService.deleteComment(CommentId);
    return null;
  }
}
