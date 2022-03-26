import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { AppLogger } from '../core/services/logger.service';
import { Comment } from './Comment.model';
import { CommentDto } from './dto/comment.dto';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/user.model';

@Injectable()
export class CommentsService implements OnModuleInit {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Comment') private readonly userModel: Model<User>,
    private appLogger: AppLogger
  ) { }

  onModuleInit() {
    console.log(`The module has been initialized.`);
  }

  /**
   * Add Comment without picture
   * @param CommentDto 
   * @returns 
   */
  addComment(commentDto: CommentDto): Observable<any> {
    let result;

    const createComment: Promise<Comment> = this.commentModel.create({
      ...commentDto,
      article: { _id: commentDto.articleId },
      author: { _id: commentDto.authorId },
    })
      .then(
        (res) => result = res.populate('author', ['firstname', 'lastname']).execPopulate()
      );

    return from(createComment);
  }

  async getComments(): Promise<Comment[]> {
    this.appLogger.warn(' getComments ')
    this.appLogger.error(' getComments ', 'test')
    this.appLogger.log(' getComments ')
    return await this.commentModel.find();
  }

  async getCommentsByArticleId(
    articleId: string,
    documentsToSkip = 0,
    limitOfDocuments?: number) {

    this.appLogger.warn(' getComments ');
    this.appLogger.error(' getComments ', 'test');
    this.appLogger.log(' getComments ');

    const id = mongoose.Types.ObjectId(articleId);

    const findQuery = this.commentModel
      .find({ article: id })
      .sort([['updatedAt', 'descending']])
      // .sort({ _id: 1 })
      .skip(documentsToSkip)
      .populate('author', ['firstname', 'lastname']);

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }
    const results = await findQuery;
    const count = await this.commentModel.countDocuments({ article: id });

    return { results, count };
  }

  async findAll(documentsToSkip = 0, limitOfDocuments?: number) {
    const findQuery = this.commentModel
      .find()
      .sort([['updatedAt', 'descending']])
      // .sort({ _id: 1 })
      .skip(documentsToSkip);

    if (limitOfDocuments) {
      findQuery.limit(limitOfDocuments);
    }
    const results = await findQuery;
    const count = await this.commentModel.count();

    return { results, count };
  }

  async getCommentById(CommentId: string): Promise<Comment> {
    return await this.commentModel.findById({ _id: CommentId });
  }

  async updateComment(CommentId: string, Comment: Partial<Comment>): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate({ _id: CommentId }, Comment, { new: true });
  }

  async deleteComment(prodId: string): Promise<void> {
    return await this.commentModel.deleteOne({ _id: prodId })
  }

}
function documentsToSkip(documentsToSkip: any) {
  throw new Error('Function not implemented.');
}

