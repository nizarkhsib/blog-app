import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss']
})
export class ArticleContentComponent implements OnInit {
  article: Article;

  constructor(
    private router: Router,
    private articleService: ArticlesService,
    private route: ActivatedRoute) {

    const articleFromState = this.router.getCurrentNavigation()?.extras?.state?.article;

    if (articleFromState) {
      this.article = articleFromState;
    } else {
      console.log('no article');
      this.route.params
        .pipe(
          switchMap((params) => {
            return this.articleService.get(params.id)
          })
        ).subscribe(
          (article) => this.article = article
        );
    }

  }

  getFullName() {
    return `${this.article.author.firstname} ${this.article.author.lastname}`
  }
  ngOnInit(): void {
  }

}
