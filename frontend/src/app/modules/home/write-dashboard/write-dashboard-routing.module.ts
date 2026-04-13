import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddArticleComponent } from './add-article/add-article.component';
import { UserArticlesComponent } from './user-articles/user-articles.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'articles',
  },
  {
    path: 'articles',
    component: UserArticlesComponent,
  },
  {
    path: 'add-article',
    component: AddArticleComponent,
  },
  {
    path: 'articles/new',
    component: AddArticleComponent,
  },
  {
    path: 'articles/edit/:id',
    component: AddArticleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WriteDashboardRoutingModule { }
