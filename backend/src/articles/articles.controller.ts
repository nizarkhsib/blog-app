import { Controller, Post, Body, Get, Param, Put, Delete, UploadedFile, UseInterceptors, Inject, UseGuards, Query } from '@nestjs/common';
import { diskStorage } from 'multer';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../core/middleware/file-management.middleware';
import { Article } from './article.model';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable } from 'rxjs';
import { PaginationParams } from 'src/pagination-params';

// @UseGuards(AuthGuard('jwt'))
@Controller('articles')
@ApiTags('Article')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Post('/with-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  async addProductWithPhoto(@UploadedFile() file, @Body() article: ArticleDto): Promise<ArticleDto> {
    return await this.articlesService.addArticleWithPhoto(file, article);
  }

  // addArticle without file "photo" data sent as json 
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'addArticle' })
  @Post()
  addArticle(@Body() ArticleDto: ArticleDto): Observable<Article> {
    return from(this.articlesService.addArticle(ArticleDto));
  }

  @ApiOperation({ summary: 'getPaginatedArticles' })
  @Get()
  async getPaginatedArticles(@Query() { skip, limit }: PaginationParams) {
    return this.articlesService.findAll(Number(skip), Number(limit));
  }

  @ApiOperation({ summary: 'getArticles' })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getArticles(): Promise<Article[]> {
    return await this.articlesService.getArticles();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'getArticleById' })
  @Get(':id')
  getArticle(@Param('id') ArticleId: string) {
    return this.articlesService.getArticleById(ArticleId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'updateCategory' })
  @Put(':id')
  async updateCategory(@Param('id') ArticleId: string, @Body() category: Article): Promise<Article> {
    return this.articlesService.updateArticle(ArticleId, category);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'removeArticle' })
  @Delete(':id')
  async removeArticle(@Param('id') ArticleId: string) {
    await this.articlesService.deleteArticle(ArticleId);
    return null;
  }
}
