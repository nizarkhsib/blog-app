import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleContentComponent } from './article-content/article-content.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesListComponent,
  },
  {
    path: ':id',
    component: ArticleContentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
