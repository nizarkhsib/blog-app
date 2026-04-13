import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-articles',
  templateUrl: './user-articles.component.html',
  styleUrls: ['./user-articles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ]
})
export class UserArticlesComponent implements OnInit {
  articles: Article[] = [];
  loading = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;

  constructor(
    private articlesService: ArticlesService,
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserArticles();
  }

  /**
   * Load user's articles
   */
  loadUserArticles(): void {
    this.loading = true;
    this.articlesService.getUserArticles(this.pageIndex, this.pageSize).subscribe(
      (response: any) => {
        this.articles = response.results;
        this.total = response.count;
        this.loading = false;
      },
      error => {
        console.error('Error loading articles', error);
        this.loading = false;
      }
    );
  }

  /**
   * Edit an article
   */
  editArticle(articleId: string): void {
    this.router.navigate([`write-dashboard/articles/edit/${articleId}`]);
  }

  /**
   * Archive an article
   */
  archiveArticle(articleId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Archive Article',
        message: 'Are you sure you want to archive this article?',
        confirmText: 'Archive',
        icon: 'archive',
        color: 'primary'
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.articlesService.archiveArticle(articleId).subscribe(
        () => {
          this.snackBar.open('Article archived successfully', 'Close', { duration: 3000 });
          this.loadUserArticles();
        },
        error => {
          console.error('Error archiving article', error);
          this.snackBar.open('Error archiving article', 'Close', { duration: 4000, panelClass: 'snackbar-error' });
        }
      );
    });
  }

  /**
   * Unarchive an article
   */
  unarchiveArticle(articleId: string): void {
    this.articlesService.unarchiveArticle(articleId).subscribe(
      () => {
        this.snackBar.open('Article unarchived successfully', 'Close', { duration: 3000 });
        this.loadUserArticles();
      },
      error => {
        console.error('Error unarchiving article', error);
        this.snackBar.open('Error unarchiving article', 'Close', { duration: 4000, panelClass: 'snackbar-error' });
      }
    );
  }

  /**
   * Delete an article permanently
   */
  deleteArticle(articleId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Article',
        message: 'Are you sure you want to permanently delete this article? This action cannot be undone.',
        confirmText: 'Delete',
        icon: 'delete_forever',
        color: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.articlesService.deleteArticle(articleId).subscribe(
        () => {
          this.snackBar.open('Article deleted successfully', 'Close', { duration: 3000 });
          this.loadUserArticles();
        },
        error => {
          console.error('Error deleting article', error);
          this.snackBar.open('Error deleting article', 'Close', { duration: 4000, panelClass: 'snackbar-error' });
        }
      );
    });
  }

  /**
   * Create new article
   */
  createNewArticle(): void {
    this.router.navigate(['write-dashboard/articles/new']);
  }

  /**
   * View article
   */
  viewArticle(articleId: string): void {
    this.router.navigate([`articles/${articleId}`]);
  }

  /**
   * Handle pagination
   */
  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUserArticles();
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    return status === 'published' ? 'accent' : 'primary';
  }
}
