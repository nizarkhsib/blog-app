import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleDto } from './dto/article.dto';
import { AppLogger } from '../core/services/logger.service';
import { Article } from './article.model';

@Injectable()
export class ArticlesService implements OnModuleInit {
  constructor(@InjectModel('Article') private readonly ArticleModel: Model<Article>, private appLogger: AppLogger
  ) { }

  onModuleInit() {
    console.log(`The module has been initialized.`);
  }

  // addProduct with file "photo"

  async addArticleWithPhoto(file, articleDto: ArticleDto): Promise<Article> {
    const newArticle = new this.ArticleModel(articleDto);
    if (file) {
      newArticle.filePath = file.path;
    }

    await newArticle.save();

    return newArticle.toObject({ versionKey: false });
  }

  /**
   * Add Article without picture
   * @param articleDto 
   * @returns 
   */
  async addArticle(ArticleDto: ArticleDto): Promise<Article> {
    const newArticle = new this.ArticleModel(ArticleDto);
    await newArticle.save();
    return newArticle.toObject({ versionKey: false });
  }

  async getArticles(): Promise<Article[]> {
    this.appLogger.warn(' getArticles ')
    this.appLogger.error(' getArticles ', 'test')
    this.appLogger.log(' getArticles ')
    return await this.ArticleModel.find();
  }

  async findAll(documentsToSkip = 0, limitOfDocuments?: number) {
    const findQuery = this.ArticleModel
      .find()
      .sort([['updatedAt', 'descending']])
      // .sort({ _id: 1 })
      .skip(documentsToSkip)
      .populate('author')
      .populate('categories');

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }
    const results = await findQuery;
    const count = await this.ArticleModel.count();

    return { results, count };
  }

  async getArticleById(ArticleId: string): Promise<Article> {
    return await this.ArticleModel.findById({ _id: ArticleId });
  }

  async updateArticle(ArticleId: string, Article: Partial<Article>): Promise<Article> {
    return this.ArticleModel.findByIdAndUpdate({ _id: ArticleId }, Article, { new: true });
  }

  async deleteArticle(prodId: string): Promise<void> {
    return await this.ArticleModel.deleteOne({ _id: prodId })
  }

}