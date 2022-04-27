import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { PaginatedResult } from 'src/app/shared/services/paginated-result';

@Component({
  selector: 'articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() rendered;
  skip = 0; // how many elements to skip
  pageSize = 4; // page size
  count = 0; // all articles number
  articles: Article[] = [];
  gridColumns = 1;
  isReadMore = true;
  isLoading = true;

  @ViewChild('content', { read: ElementRef, static: false }) element: ElementRef;

  constructor(
    private articlesBackendService: ArticlesService,
    private router: Router) { }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.fetchArticlesList();
  }

  sliderChange(event) {
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
          this.articles.push(...res.results)
          this.count = res.count;
        }
      );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {

    const isOnBottom = event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight - 50;

    if (isOnBottom && this.articles.length < this.count && !this.isLoading) {
      this.skip = this.skip + this.pageSize;
      this.fetchArticlesList();
    }

  }

  articleClicked(article: Article) {
    this.router.navigate(['articles/' + article._id], { state: { article: article } });
  }

}
