import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';
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
  skip = 0;
  pageSize = 4;
  count = 0;
  articles: Article[] = [];
  gridColumns = 1;
  isLoading = true;
  searchQuery = '';

  private searchSubject = new Subject<string>();

  @ViewChild('sentinel', { read: ElementRef, static: false }) sentinel!: ElementRef;

  private observer!: IntersectionObserver;

  constructor(
    private articlesBackendService: ArticlesService,
    private router: Router) { }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.resetAndFetch();
    });

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
    this.searchSubject.complete();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value.trim());
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  private resetAndFetch(): void {
    this.skip = 0;
    this.articles = [];
    this.count = 0;
    this.fetchArticlesList();
  }

  sliderChange(event: any) {
    this.gridColumns = event.value;
  }

  fetchArticlesList() {
    this.isLoading = true;

    const request$ = this.searchQuery
      ? this.articlesBackendService.searchArticles(this.searchQuery, this.skip / this.pageSize, this.pageSize)
      : this.articlesBackendService.getPaginatedList(this.pageSize, this.skip);

    request$
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        (res: PaginatedResult<Article>) => {
          if (this.skip === 0) {
            this.articles = res.results;
          } else {
            this.articles.push(...res.results);
          }
          this.count = res.count;
        }
      );
  }

  articleClicked(article: Article) {
    this.router.navigate(['articles/' + article._id], { state: { article: article } });
  }

}
