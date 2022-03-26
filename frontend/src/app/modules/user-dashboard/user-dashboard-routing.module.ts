import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddArticleComponent } from './add-article/add-article.component';

const routes: Routes = [


  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'add-article',
  },
  {
    path: 'add-article',
    component: AddArticleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDashboardRoutingModule { }
