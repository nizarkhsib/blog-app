import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Article } from 'src/app/shared/models/article';
import { Comment, CommentDto } from 'src/app/shared/models/comment';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss'],
  standalone: false
})
export class ArticleContentComponent implements OnInit {
  article!: Article;
  authorPhotoUrl: string | null = null;

  // Likes
  likesCount = 0;
  isLiked = false;
  likeLoading = false;

  // Comments
  isLogged = false;
  commentInput = '';
  commentsList: Comment[] = [];
  commentsCount = 0;
  commentsLoading = false;
  skip = 0;
  pageSize = 10;

  constructor(
    private router: Router,
    private articleService: ArticlesService,
    private commentsService: CommentsService,
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private route: ActivatedRoute) {

    this.isLogged = !!this.authService.currentUserSubject.getValue();

    const articleFromState = this.router.getCurrentNavigation()?.extras?.state?.article;

    if (articleFromState) {
      this.article = articleFromState;
      this.loadAuthorPhoto();
      this.initInteractions();
    } else {
      this.route.params
        .pipe(switchMap((params) => this.articleService.get(params.id)))
        .subscribe(
          (article) => {
            this.article = article;
            this.loadAuthorPhoto();
            this.initInteractions();
          },
          () => this.router.navigate([''])
        );
    }
  }

  ngOnInit(): void {
    this.isLogged = !!this.authService.currentUserSubject.getValue();
  }

  private loadAuthorPhoto(): void {
    const authorId = this.article?.author?._id;
    if (!authorId) return;
    this.profileService.getProfileByUserId(authorId).subscribe({
      next: (profile) => { this.authorPhotoUrl = profile?.photoPath || null; },
      error: () => {}
    });
  }

  private initInteractions(): void {
    if (!this.article?._id) return;
    this.likesCount = this.article.likes || 0;
    this.fetchComments();
    if (this.isLogged) {
      this.loadLikeStatus();
    }
  }

  loadLikeStatus(): void {
    this.articleService.isLiked(this.article._id!).subscribe({
      next: (res) => { this.isLiked = res.liked; },
      error: () => {}
    });
  }

  toggleLike(): void {
    if (!this.isLogged) {
      this.router.navigate(['auth/register']);
      return;
    }
    if (this.likeLoading || !this.article?._id) return;
    this.likeLoading = true;
    this.articleService.toggleLike(this.article._id!).subscribe({
      next: (res) => {
        this.isLiked = res.liked;
        this.likesCount = res.likes;
        this.likeLoading = false;
      },
      error: () => { this.likeLoading = false; }
    });
  }

  fetchComments(): void {
    if (!this.article?._id) return;
    this.commentsLoading = true;
    this.commentsService.getCommentsByArticleId(this.article._id!, this.pageSize, this.skip)
      .subscribe({
        next: (res: any) => {
          this.commentsCount = res.count;
          this.commentsList = this.skip === 0 ? res.results : [...this.commentsList, ...res.results];
          this.commentsLoading = false;
        },
        error: () => { this.commentsLoading = false; }
      });
  }

  onSendComment(): void {
    const currentUser = this.authService.currentUserSubject.getValue();
    if (!currentUser?._id || !this.commentInput.trim()) return;

    const dto: CommentDto = {
      articleId: this.article._id!,
      authorId: currentUser._id,
      content: this.commentInput.trim()
    };

    this.commentsService.post(dto).subscribe((newComment) => {
      this.commentInput = '';
      this.commentsList.unshift(newComment);
      this.commentsCount++;
    });
  }

  onViewMore(): void {
    this.skip += this.pageSize;
    this.fetchComments();
  }

  getFullName(): string {
    return `${this.article?.author?.firstname} ${this.article?.author?.lastname}`;
  }

  visitAuthorProfile(): void {
    if (this.article?.author?._id) {
      this.router.navigate(['/profile', this.article.author._id]);
    }
  }
}

