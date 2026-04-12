import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../../models/article';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  standalone: false
})
export class ArticleCardComponent implements OnInit {

  @Input() article!: Article;
  @Input() index!: number;

  previewText = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.previewText = new DOMParser()
      .parseFromString(this.article?.content || '', 'text/html')
      .documentElement.textContent?.slice(0, 170).concat('...') || '';
  }

}
