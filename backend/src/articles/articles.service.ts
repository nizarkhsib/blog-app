import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { ArticleDto } from './dto/article.dto';
import { AppLogger } from '../core/services/logger.service';
import { Article } from './article.model';

@Injectable()
export class ArticlesService implements OnModuleInit {
  constructor(@InjectModel('Article') private readonly articleModel: Model<Article>,
    private appLogger: AppLogger
  ) { }

  onModuleInit() {
  }

  /**
   * Create a new article
   */
  async createArticle(userId: string, articleDto: ArticleDto): Promise<Article> {
    const newArticle = new this.articleModel({
      ...articleDto,
      userId: userId,
      author: userId,
      status: articleDto.status || 'draft'
    });

    const createdArticle = await newArticle.save();
    return createdArticle.populate('author', ['firstname', 'lastname', 'profileImage']);
  }

  async createArticleWithCover(userId: string, articleDto: any): Promise<Article> {
    const processedArticle = { ...articleDto };

    if (articleDto.coverImage) {
      if (typeof articleDto.coverImage === 'string') {
        const dataUriMatch = articleDto.coverImage.match(/^data:(.+);base64,(.+)$/);
        if (dataUriMatch) {
          processedArticle.coverImage = {
            data: Buffer.from(dataUriMatch[2], 'base64'),
            contentType: dataUriMatch[1],
          };
        } else {
          const base64String = articleDto.coverImage.replace(/\s/g, '');
          if (/^[A-Za-z0-9+/=]+$/.test(base64String) && base64String.length % 4 === 0) {
            processedArticle.coverImage = {
              data: Buffer.from(base64String, 'base64'),
              contentType: articleDto.coverImageContentType || 'application/octet-stream',
            };
          }
        }
      }
    }

    const newArticle = new this.articleModel({
      ...processedArticle,
      userId: userId,
      author: userId,
      status: processedArticle.status || 'draft',
      coverImage: processedArticle.coverImage ?? null,
    });

    const createdArticle = await newArticle.save();
    return createdArticle.populate('author', ['firstname', 'lastname', 'profileImage']);
  }

  /**
   * Get all published articles (for public view)
   */
  async getPublishedArticles(documentsToSkip = 0, limitOfDocuments = 10) {
    const findQuery = this.articleModel
      .find({ status: 'published', archived: false })
      .sort([['datePublished', 'descending']])
      .skip(documentsToSkip)
      .limit(limitOfDocuments)
      .populate('author', ['firstname', 'lastname', 'profileImage', 'bio']);

    const results = await findQuery;
    const count = await this.articleModel.countDocuments({ status: 'published', archived: false });

    return { results, count };
  }

  /**
   * Get user's articles (both draft and published)
   */
  async getUserArticles(userId: string, documentsToSkip = 0, limitOfDocuments = 10) {
    const findQuery = this.articleModel
      .find({ userId: userId })
      .sort([['updatedAt', 'descending']])
      .skip(documentsToSkip)
      .limit(limitOfDocuments)
      .populate('author', ['firstname', 'lastname', 'profileImage']);

    const results = await findQuery;
    const count = await this.articleModel.countDocuments({ userId: userId });

    return { results, count };
  }

  /**
   * Get article by ID
   */
  async getArticleById(articleId: string): Promise<Article> {
    const article = await this.articleModel
      .findById(articleId)
      .populate('author', ['firstname', 'lastname', 'profileImage', 'bio']);
    
    if (article) {
      // Increment view count
      article.views = (article.views || 0) + 1;
      await article.save();
    }
    
    return article;
  }

  /**
   * Update an article
   */
  async updateArticle(articleId: string, userId: string, articleDto: Partial<ArticleDto>): Promise<Article> {
    const article = await this.articleModel.findOne({ _id: articleId, userId: userId });
    
    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    if (articleDto.coverImage && typeof articleDto.coverImage === 'string') {
      const dataUriMatch = articleDto.coverImage.match(/^data:(.+);base64,(.+)$/);
      if (dataUriMatch) {
        articleDto.coverImage = {
          data: Buffer.from(dataUriMatch[2], 'base64'),
          contentType: dataUriMatch[1],
        } as any;
      } else {
        const base64String = articleDto.coverImage.replace(/\s/g, '');
        if (/^[A-Za-z0-9+/=]+$/.test(base64String) && base64String.length % 4 === 0) {
          articleDto.coverImage = {
            data: Buffer.from(base64String, 'base64'),
            contentType: articleDto.coverImageContentType || 'application/octet-stream',
          } as any;
        }
      }
    }

    // If publish status is changing to published, set datePublished
    if (articleDto.status === 'published' && article.status === 'draft') {
      articleDto['datePublished'] = new Date();
    }

    Object.assign(article, articleDto);
    return await article.save();
  }

  /**
   * Archive an article (soft delete - hides from public)
   */
  async archiveArticle(articleId: string, userId: string): Promise<Article> {
    const article = await this.articleModel.findOne({ _id: articleId, userId: userId });
    
    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    article.archived = true;
    return await article.save();
  }

  /**
   * Unarchive an article
   */
  async unarchiveArticle(articleId: string, userId: string): Promise<Article> {
    const article = await this.articleModel.findOne({ _id: articleId, userId: userId });
    
    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    article.archived = false;
    return await article.save();
  }

  /**
   * Unpublish an article (revert to draft)
   */
  async unpublishArticle(articleId: string, userId: string): Promise<Article> {
    const article = await this.articleModel.findOne({ _id: articleId, userId: userId });

    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    article.status = 'draft';
    return await article.save();
  }

  /**
   * Delete an article permanently
   */
  async deleteArticle(articleId: string, userId: string): Promise<void> {
    const article = await this.articleModel.findOne({ _id: articleId, userId: userId });
    
    if (!article) {
      throw new Error('Article not found or unauthorized');
    }

    await this.articleModel.deleteOne({ _id: articleId });
  }

  /**
   * Get published articles by a specific writer
   */
  async getArticlesByWriter(writerId: string, documentsToSkip = 0, limitOfDocuments = 10) {
    const findQuery = this.articleModel
      .find({ userId: writerId, status: 'published', archived: false })
      .sort([['datePublished', 'descending']])
      .skip(documentsToSkip)
      .limit(limitOfDocuments)
      .populate('author', ['firstname', 'lastname', 'profileImage', 'bio']);

    const results = await findQuery;
    const count = await this.articleModel.countDocuments({ userId: writerId, status: 'published', archived: false });

    return { results, count };
  }

  /**
   * Search articles by title or tags
   */
  async searchArticles(query: string, documentsToSkip = 0, limitOfDocuments = 10) {
    const findQuery = this.articleModel
      .find({
        $and: [
          { 
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } }
            ] 
          },
          { status: 'published', archived: false }
        ]
      })
      .sort([['datePublished', 'descending']])
      .skip(documentsToSkip)
      .limit(limitOfDocuments)
      .populate('author', ['firstname', 'lastname', 'profileImage']);

    const results = await findQuery;
    const count = await this.articleModel.countDocuments({
      $and: [
        { 
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ] 
        },
        { status: 'published', archived: false }
      ]
    });

    return { results, count };
  }

  async toggleLike(articleId: string, userId: string): Promise<{ liked: boolean; likes: number }> {
    const id = new mongoose.Types.ObjectId(articleId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const article = await this.articleModel.findById(id, { likes: 1, likedBy: 1 });
    if (!article) throw new Error('Article not found');

    const alreadyLiked = article.likedBy?.some(lid => lid.toString() === userObjectId.toString());

    if (alreadyLiked) {
      await this.articleModel.findByIdAndUpdate(id, {
        $pull: { likedBy: userObjectId },
        $inc: { likes: -1 }
      });
      return { liked: false, likes: Math.max((article.likes || 1) - 1, 0) };
    } else {
      await this.articleModel.findByIdAndUpdate(id, {
        $addToSet: { likedBy: userObjectId },
        $inc: { likes: 1 }
      });
      return { liked: true, likes: (article.likes || 0) + 1 };
    }
  }

  async isLikedBy(articleId: string, userId: string): Promise<{ liked: boolean }> {
    const id = new mongoose.Types.ObjectId(articleId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const article = await this.articleModel.findById(id, { likedBy: 1 });
    if (!article) return { liked: false };

    const liked = article.likedBy?.some(lid => lid.toString() === userObjectId.toString());
    return { liked: !!liked };
  }

}
