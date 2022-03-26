import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../models/article';
import { CommentDto, Comment } from '../../models/comment.dto';
import { LoggedUserDto } from '../../models/logged-user-dto';
import { AuthenticationService } from '../../services/authentication.service';
import { CommentsService } from '../../services/comments.service';
import { PaginatedResult } from '../../services/paginated-result';

@Component({
  selector: 'article-card',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss']
})
export class ArticleItemComponent implements OnInit {

  @Input() article: Article;
  isReadMore = true;
  isCommentInputHidden = true;
  isLogged = false;

  skip = 0; // how many elements to skip
  pageSize = 4; // page size
  commentsCount = 0; // comments number

  commentInput: string = '';
  commentsList: Comment[];

  constructor(
    private authenticationService: AuthenticationService,
    private commentsBackendService: CommentsService) {
  }

  ngOnInit(): void {
    const loggedUser = this.authenticationService.currentUserSubject.getValue();
    loggedUser ? this.isLogged = true : this.isLogged = false;
    this.fetchComments();
  }

  fetchComments() {
    this.commentsBackendService
      .getCommentsByArticleId(this.article._id, this.pageSize, this.skip)
      .subscribe(
        (res: PaginatedResult<Comment>) => {
          this.commentsCount = res.count;
          if (this.skip === 0) {
            this.commentsList = res.results;
          } else {
            this.commentsList = [...this.commentsList, ...res.results];
          }
        }
      );
  }

  showText() {
    this.isReadMore = !this.isReadMore
  }

  onSendComment() {

    const comment: CommentDto = {
      articleId: this.article._id,
      authorId: this.authenticationService.currentUserSubject.getValue()._id,
      content: this.commentInput
    };

    this.commentsBackendService
      .post(comment)
      .subscribe(
        (newComment) => {
          this.commentInput = '';
          this.commentsList.splice(0, 0, newComment);
        }
      );
  }

  onViewMore() {
    this.skip = this.skip + this.pageSize;
    this.fetchComments();
  }

}
