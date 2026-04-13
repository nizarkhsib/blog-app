import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-user-articles',
  templateUrl: './user-articles.component.html',
  styleUrls: ['./user-articles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ]
})
export class UserArticlesComponent implements OnInit {
  articles: Article[] = [];
  loading = false;
  displayedColumns: string[] = ['title', 'description', 'status', 'createdAt', 'actions'];
  pageIndex = 0;
  pageSize = 10;
  total = 0;

  constructor(
    private articlesService: ArticlesService,
    private authService: AuthenticationService,
    private router: Router
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
    if (confirm('Are you sure you want to archive this article?')) {
      this.articlesService.archiveArticle(articleId).subscribe(
        () => {
          alert('Article archived successfully');
          this.loadUserArticles();
        },
        error => {
          console.error('Error archiving article', error);
          alert('Error archiving article');
        }
      );
    }
  }

  /**
   * Unarchive an article
   */
  unarchiveArticle(articleId: string): void {
    this.articlesService.unarchiveArticle(articleId).subscribe(
      () => {
        alert('Article unarchived successfully');
        this.loadUserArticles();
      },
      error => {
        console.error('Error unarchiving article', error);
        alert('Error unarchiving article');
      }
    );
  }

  /**
   * Delete an article permanently
   */
  deleteArticle(articleId: string): void {
    if (confirm('Are you sure you want to permanently delete this article? This action cannot be undone.')) {
      this.articlesService.deleteArticle(articleId).subscribe(
        () => {
          alert('Article deleted successfully');
          this.loadUserArticles();
        },
        error => {
          console.error('Error deleting article', error);
          alert('Error deleting article');
        }
      );
    }
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
