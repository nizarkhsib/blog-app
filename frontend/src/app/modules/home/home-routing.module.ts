import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  {
    path: 'articles',
    component: NavigationComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./articles/articles.module')
          .then(m => m.ArticlesModule)
      },
    ]
  },
  {
    path: 'write-dashboard',
    component: NavigationComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./write-dashboard/write-dashboard.module')
          .then(m => m.WriteDashboardModule)
      },
    ]
  },
  {
    path: 'profile',
    component: NavigationComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./profile/profile.module')
          .then(m => m.ProfileModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class HomeRoutingModule { }
