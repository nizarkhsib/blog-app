import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { PaginatedResult } from 'src/app/shared/services/paginated-result';

@Component({
  selector: 'articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit, OnDestroy, AfterViewInit {

  skip = 0; // how many elements to skip
  pageSize = 4; // page size
  count = 0; // all articles number
  articles: Article[] = [];
  gridColumns = 1;
  @Output() rendered;
  isReadMore = true;

  @ViewChild('content', { read: ElementRef, static: false }) element: ElementRef;

  constructor(
    private articlesBackendService: ArticlesService,
    private renderer2: Renderer2) { }

  ngAfterViewInit(): void {


  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.fetchArticlesList();
  }

  onPageChange(event) {
    this.pageSize = event.pageSize;
    if (event.previousPageIndex < event.pageIndex)
      this.skip = this.skip + this.pageSize;
    else if (event.previousPageIndex > event.pageIndex) {
      this.skip = this.skip - this.pageSize;
    }
    this.fetchArticlesList();
  }

  sliderChange(event) {
    this.gridColumns = event.value;
  }

  fetchArticlesList() {
    this.articlesBackendService
      .getPaginatedList(this.pageSize, this.skip)
      .subscribe(
        (res: PaginatedResult<Article>) => {
          this.articles = res.results;
          this.count = res.count;
        }
      );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    // console.log('type of ', event);
    const isOnBottom = event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight - 50;

    console.log('isOnBottom', isOnBottom);
  }

}
