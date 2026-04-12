import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { PaginatedResult } from 'src/app/shared/services/paginated-result';

@Component({
  selector: 'articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  standalone: false
})
export class ArticlesListComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() rendered: EventEmitter<void> = new EventEmitter<void>();
  skip = 0; // how many elements to skip
  pageSize = 4; // page size
  count = 0; // all articles number
  articles: Article[] = [];
  gridColumns = 1;
  isLoading = true;

  @ViewChild('sentinel', { read: ElementRef, static: false }) sentinel!: ElementRef;

  private observer!: IntersectionObserver;

  constructor(
    private articlesBackendService: ArticlesService,
    private router: Router) { }

  ngOnInit(): void {
    this.fetchArticlesList();
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && this.articles.length < this.count && !this.isLoading) {
          this.skip += this.pageSize;
          this.fetchArticlesList();
        }
      },
      { threshold: 0.1 }
    );
    if (this.sentinel) {
      this.observer.observe(this.sentinel.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  sliderChange(event: any) {
    this.gridColumns = event.value;
  }

  fetchArticlesList() {
    this.isLoading = true;
    this.articlesBackendService
      .getPaginatedList(this.pageSize, this.skip)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        (res: PaginatedResult<Article>) => {
          this.articles.push(...res.results);
          this.count = res.count;
        }
      );
  }

  articleClicked(article: Article) {
    this.router.navigate(['articles/' + article._id], { state: { article: article } });
  }

}
