import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { Article } from 'src/app/shared/models/article';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-articles-list',
  templateUrl: './user-articles-list.component.html',
  styleUrls: ['./user-articles-list.component.scss'],
  standalone: false
})
export class UserArticlesListComponent implements OnInit, OnChanges {

  @Input() userId: string = '';
  @Input() isOwnProfile = false;
  userArticles: Article[] = [];
  articlesLoading = false;
  articlesError: string | null = null;

  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.userId) {
      this.loadUserArticles();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.loadUserArticles();
    }
  }

  loadUserArticles(): void {
    if (!this.userId) {
      return;
    }

    this.articlesLoading = true;
    this.articlesError = null;

    const loggedUser = this.authenticationService.currentUserSubject.getValue();
    const isOwnProfile = loggedUser?._id === this.userId;

    // If viewing own profile and logged in, get all articles (draft + published)
    // Otherwise, get published articles only
    const articleRequest = isOwnProfile && loggedUser
      ? this.articlesService.getUserArticles(0, 10)
      : this.articlesService.getArticlesByWriter(this.userId, 0, 10);

    articleRequest.subscribe(
      (response: any) => {
        const articles = response.results || response;
        this.userArticles = articles;
        this.articlesLoading = false;
      },
      error => {
        this.articlesError = 'Failed to load articles';
        console.error('Error loading articles:', error);
        this.articlesLoading = false;
      }
    );
  }

  viewArticle(articleId: string): void {
    this.router.navigate(['/articles', articleId]);
  }

  editArticle(articleId: string): void {
    this.router.navigate(['/write-dashboard/articles/edit', articleId]);
  }

  unpublishArticle(article: Article): void {
    if (!article._id) return;
    this.articlesService.unpublishArticle(article._id).subscribe({
      next: () => {
        this.userArticles = this.userArticles.map(a =>
          a._id === article._id ? { ...a, status: 'draft' } : a
        );
      },
      error: (err) => console.error('Failed to unpublish article:', err)
    });
  }

  publishArticle(article: Article): void {
    if (!article._id) return;
    this.articlesService.updateArticle(article._id, { status: 'published' }).subscribe({
      next: () => {
        this.userArticles = this.userArticles.map(a =>
          a._id === article._id ? { ...a, status: 'published' } : a
        );
      },
      error: (err) => console.error('Failed to publish article:', err)
    });
  }

  deleteArticle(article: Article): void {
    if (!article._id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Article',
        message: `Delete "${article.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        icon: 'delete_forever',
        color: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.articlesService.deleteArticle(article._id!).subscribe({
        next: () => {
          this.userArticles = this.userArticles.filter(a => a._id !== article._id);
          this.snackBar.open('Article deleted successfully', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Failed to delete article:', err);
          this.snackBar.open('Failed to delete article', 'Close', { duration: 4000, panelClass: 'snackbar-error' });
        }
      });
    });
  }

}
