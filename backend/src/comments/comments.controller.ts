import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { Comment } from './Comment.model';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable, of } from 'rxjs';
import { PaginationParams } from 'src/pagination-params';
import { CommentDto } from './dto/comment.dto';
import { CommentsService } from './comments.service';

@UseGuards(AuthGuard('jwt'))
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

  @ApiOperation({ summary: 'getComments' })
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

  @ApiOperation({ summary: 'getComments' })
  @Get()
  async getComments(): Promise<Comment[]> {
    return await this.commentsService.getComments();
  }

  // @ApiOperation({ summary: 'getCommentById' })
  // @Get(':id')
  // getComment(@Param('id') CommentId: string) {
  //   return this.commentsService.getCommentById(CommentId);
  // }

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