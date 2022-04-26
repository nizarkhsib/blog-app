import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesListComponent } from './articles/articles-list/articles-list.component';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./articles/articles.module')
          .then(m => m.UserDashboardModule)
      },
      {
        path: 'user-dashboard',
        loadChildren: () => import('../user-dashboard/user-dashboard.module')
          .then(m => m.UserDashboardModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module')
          .then(m => m.ProfileModule)
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('../login/login.module').then(m => m.LoginModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class HomeRoutingModule { }
