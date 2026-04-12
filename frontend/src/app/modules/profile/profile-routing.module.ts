import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'me',
    pathMatch: 'full'
  },
  {
    path: ':userId',
    component: ProfileComponent,
    children: [
      {
        path: 'profile-edit',
        component: ProfileEditComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
