import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Query, Req, Res, BadRequestException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { Article } from './article.model';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PaginationParams } from '../pagination-params';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { imageFileFilter } from '../core/middleware/file-management.middleware';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('articles')
@ApiTags('Article')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly notificationsService: NotificationsService,
  ) { }

  /**
   * Create a new article
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create article' })
  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
    }),
  )
  async createArticle(@Req() req: Request, @UploadedFiles() files: Array<any>, @Body() articleDto: any): Promise<Article> {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const payload = typeof articleDto?.article === 'string' ? JSON.parse(articleDto.article) : articleDto;
    const file = files?.[0];
    const coverImage = file?.buffer
      ? { data: file.buffer, contentType: file.mimetype }
      : payload?.coverImage ?? null;

    return await this.articlesService.createArticleWithCover(userId, {
      ...payload,
      coverImage,
    });
  }

  /**
   * Get all published articles (public view)
   */
  @ApiOperation({ summary: 'Get published articles' })
  @Get()
  async getArticles(@Query() { skip = 0, limit = 10 }: PaginationParams) {
    return this.articlesService.getPublishedArticles(Number(skip), Number(limit));
  }

  @ApiOperation({ summary: 'Get published articles' })
  @Get('published')
  async getPublishedArticles(@Query() { skip = 0, limit = 10 }: PaginationParams) {
    return this.articlesService.getPublishedArticles(Number(skip), Number(limit));
  }

  /**
   * Get user's own articles (draft and published)
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user articles' })
  @Get('user/me')
  async getUserArticles(@Req() req: Request, @Query() { skip = 0, limit = 10 }: PaginationParams) {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.articlesService.getUserArticles(userId, Number(skip), Number(limit));
  }

  /**
   * Get published articles by a specific writer
   */
  @ApiOperation({ summary: 'Get articles by writer' })
  @Get('writer/:writerId')
  async getArticlesByWriter(@Param('writerId') writerId: string, @Query() { skip = 0, limit = 10 }: PaginationParams) {
    return this.articlesService.getArticlesByWriter(writerId, Number(skip), Number(limit));
  }

  /**
   * Search articles
   */
  @ApiOperation({ summary: 'Search articles' })
  @Get('search')
  async searchArticles(@Query('q') query: string, @Query() { skip = 0, limit = 10 }: PaginationParams) {
    return this.articlesService.searchArticles(query || '', Number(skip), Number(limit));
  }

  /**
   * Toggle like on an article
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like on article' })
  @Post(':id/like')
  async toggleLike(@Param('id') articleId: string, @Req() req: Request) {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) throw new BadRequestException('User not authenticated');
    const result = await this.articlesService.toggleLike(articleId, userId);

    // Send notification to article author on like
    if (result.liked) {
      const article = await this.articlesService.getArticleById(articleId);
      if (article) {
        const authorId = (article.author as any)?._id?.toString() || article.userId?.toString();
        const senderName = authUser['firstname'] || 'Someone';
        this.notificationsService.create({
          recipient: authorId,
          sender: userId,
          type: 'like',
          article: articleId,
          message: `${senderName} liked your article "${article.title}"`,
        }).catch(() => {});
      }
    }

    return result;
  }

  /**
   * Check if current user liked an article
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if user liked article' })
  @Get(':id/liked')
  async isLiked(@Param('id') articleId: string, @Req() req: Request) {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) throw new BadRequestException('User not authenticated');
    return this.articlesService.isLikedBy(articleId, userId);
  }

  /**
   * Get article cover image
   */
  @ApiOperation({ summary: 'Get article cover image' })
  @Get(':id/cover')
  async getArticleCover(@Param('id') articleId: string, @Res() res: Response) {
    const cover = await this.articlesService.getArticleCoverImage(articleId);
    if (!cover?.data) {
      return res.status(404).send('No cover image found');
    }
    res.setHeader('Content-Type', cover.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cover.data);
  }

  /**
   * Get article by ID
   */
  @ApiOperation({ summary: 'Get article by ID' })
  @Get(':id')
  async getArticle(@Param('id') articleId: string): Promise<Article> {
    return this.articlesService.getArticleById(articleId);
  }

  /**
   * Update an article
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update article' })
  @Put(':id')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
    }),
  )
  async updateArticle(
    @Param('id') articleId: string,
    @Req() req: Request,
    @UploadedFiles() files: Array<any>,
    @Body() articleDto: any
  ): Promise<Article> {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const payload = typeof articleDto?.article === 'string' ? JSON.parse(articleDto.article) : articleDto;
    const file = files?.[0];
    const coverImage = file?.buffer
      ? { data: file.buffer, contentType: file.mimetype }
      : payload?.coverImage ?? null;

    return this.articlesService.updateArticle(articleId, userId, {
      ...payload,
      coverImage,
    });
  }

  /**
   * Archive an article (soft delete)
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive article' })
  @Put(':id/archive')
  async archiveArticle(@Param('id') articleId: string, @Req() req: Request): Promise<Article> {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.articlesService.archiveArticle(articleId, userId);
  }

  /**
   * Unarchive an article
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unarchive article' })
  @Put(':id/unarchive')
  async unarchiveArticle(@Param('id') articleId: string, @Req() req: Request): Promise<Article> {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.articlesService.unarchiveArticle(articleId, userId);
  }

  /**
   * Unpublish an article (revert to draft)
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish article' })
  @Put(':id/unpublish')
  async unpublishArticle(@Param('id') articleId: string, @Req() req: Request): Promise<Article> {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.articlesService.unpublishArticle(articleId, userId);
  }

  /**
   * Delete an article permanently
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete article' })
  @Delete(':id')
  async deleteArticle(@Param('id') articleId: string, @Req() req: Request): Promise<void> {
    const authUser = req.user['user'] || req.user;
    const userId = authUser['id'] || authUser['_id'];
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.articlesService.deleteArticle(articleId, userId);
  }
}
