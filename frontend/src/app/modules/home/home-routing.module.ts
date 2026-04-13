import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'articles',
  },
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: 'articles',
        loadChildren: () => import('./articles/articles.module')
          .then(m => m.ArticlesModule)
      },
      {
        path: 'write-dashboard',
        loadChildren: () => import('./write-dashboard/write-dashboard.module')
          .then(m => m.WriteDashboardModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module')
          .then(m => m.ProfileModule)
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('../login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class HomeRoutingModule { }
