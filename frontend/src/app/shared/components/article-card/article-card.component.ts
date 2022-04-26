import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../../models/article';
import { CommentDto } from '../../models/comment';
import { AuthenticationService } from '../../services/authentication.service';
import { CommentsService } from '../../services/comments.service';
import { PaginatedResult } from '../../services/paginated-result';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input() article: Article;
  @Input() index: number;

  public sanitizer: DomSanitizer;

  isReadMoreDisplayed = true;
  isCommentInputHidden = true;
  hasMoreContent = false;
  isLogged = false;

  skip = 0; // how many elements to skip
  pageSize = 4; // page size
  commentsCount = 0; // comments number

  commentInput: string = '';
  commentsList: Comment[];
  previewText = '';

  constructor(
    private authenticationService: AuthenticationService,
    private commentsBackendService: CommentsService,
    private router: Router) {
  }

  ngOnInit(): void {
    const loggedUser = this.authenticationService.currentUserSubject.getValue();
    loggedUser ? this.isLogged = true : this.isLogged = false;
    this.previewText = new DOMParser()
      .parseFromString(this.article.content, "text/html")
      .documentElement.textContent.slice(0, 130);

    this.isShowMoreDisplayed();
    this.fetchComments();
  }

  isShowMoreDisplayed() {

    const paragraphs = this.article.content.split("</p>");

    const filteredParagraphs = paragraphs.filter(p => p.length > 0);

    if (filteredParagraphs.length === 1) {

      const firstParagraphContent = this.textFromHtml(paragraphs[0]);

      if (firstParagraphContent.length > 193) {
        this.hasMoreContent = true;
      } else {
        this.hasMoreContent = false;
      }
    } else {
      this.hasMoreContent = true;
    }
  }

  textFromHtml(htmlContent) {
    return new DOMParser()
      .parseFromString(htmlContent, "text/html")
      .documentElement.textContent;
  }

  firstParagraph() {
    const paragraphs = this.article.content.split("</p>")
    return paragraphs[0] + '</p>';
  }

  getArticleContent() {

    if (!this.isReadMoreDisplayed) {
      return this.article.content;
    } else {
      return this.firstParagraph();
    }

  }

  stringToHTML = (str: string) => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };

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
    this.isReadMoreDisplayed = !this.isReadMoreDisplayed
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
          this.commentsCount = this.commentsCount + 1;
        }
      );
  }

  onViewMore() {
    this.skip = this.skip + this.pageSize;
    this.fetchComments();
  }

  navigateToResgiter() {
    this.router.navigate(['auth/register']);
  }

}
