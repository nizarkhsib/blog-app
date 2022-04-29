import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleDto } from './dto/article.dto';
import { AppLogger } from '../core/services/logger.service';
import { Article } from './article.model';

@Injectable()
export class ArticlesService implements OnModuleInit {
  constructor(@InjectModel('Article') private readonly articleModel: Model<Article>,
    private appLogger: AppLogger
  ) { }

  onModuleInit() {
    console.log(`The module has been initialized.`);
  }

  // addProduct with file "photo"

  async addArticleWithPhoto(file, articleDto: ArticleDto): Promise<Article> {

    articleDto.tags = String(articleDto.tags).split(',');

    let result;

    const newArticle = new this.articleModel({
      ...articleDto,
      author: { _id: articleDto.userId }
    });
    if (file) {
      newArticle.filePath = file.path;
    }

    const createdArticle: Promise<Article> = newArticle
      .save()
      .then(
        (res) => result = res.populate('author', ['firstname', 'lastname']).execPopulate()
      );

    return await createdArticle;
  }

  /**
   * Add Article without picture
   * @param articleDto 
   * @returns 
   */
  async addArticle(ArticleDto: ArticleDto): Promise<Article> {
    const newArticle = new this.articleModel(ArticleDto);
    await newArticle.save();
    return newArticle.toObject({ versionKey: false });
  }

  async getArticles(): Promise<Article[]> {
    this.appLogger.warn(' getArticles ')
    this.appLogger.error(' getArticles ', 'test')
    this.appLogger.log(' getArticles ')
    return await this.articleModel.find();
  }

  async findAll(documentsToSkip = 0, limitOfDocuments?: number) {
    const findQuery = this.articleModel
      .find()
      .sort([['updatedAt', 'descending']])
      // .sort({ _id: 1 })
      .skip(documentsToSkip)
      .populate('author', ['firstname', 'lastname'])
      .populate('categories');

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }
    const results = await findQuery;
    const count = await this.articleModel.count();

    return { results, count };
  }

  async getArticleById(ArticleId: string): Promise<Article> {
    return await this.articleModel.findById({ _id: ArticleId }).populate('author', ['firstname', 'lastname']);
  }

  async updateArticle(ArticleId: string, Article: Partial<Article>): Promise<Article> {
    return this.articleModel.findByIdAndUpdate({ _id: ArticleId }, Article, { new: true });
  }

  async deleteArticle(prodId: string): Promise<void> {
    return await this.articleModel.deleteOne({ _id: prodId })
  }

}
