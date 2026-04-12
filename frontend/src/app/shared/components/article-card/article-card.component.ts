import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../models/article';

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

  constructor() {
  }

  ngOnInit(): void {
    this.previewText = new DOMParser()
      .parseFromString(this.article?.content || '', 'text/html')
      .documentElement.textContent?.slice(0, 170).concat('...') || '';
  }

}
