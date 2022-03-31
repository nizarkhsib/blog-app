import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { Comment } from './comment.model';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable, of } from 'rxjs';
import { PaginationParams } from 'src/pagination-params';
import { CommentDto } from './dto/comment.dto';
import { CommentsService } from './comments.service';

@Controller('Comments')
@ApiTags('Comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  // addComment without file "photo" data sent as json 
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'addComment' })
  @Post()
  addComment(@Body() CommentDto: CommentDto): Observable<Comment> {
    return from(this.commentsService.addComment(CommentDto));
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
