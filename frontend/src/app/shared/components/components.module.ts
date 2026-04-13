import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ArticleCardComponent } from './article-card/article-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { CommentsComponent } from './article-card/comments/comments.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarComponent } from './avatar/avatar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FollowersModalComponent } from './followers-modal/followers-modal.component';

@NgModule({
  declarations: [
    ListComponent,
    ArticleCardComponent,
    CommentsComponent,
    ProfileCardComponent,
    AvatarComponent,
    FollowersModalComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDialogModule
  ],
  exports: [
    ListComponent,
    ArticleCardComponent,
    ProfileCardComponent,
    AvatarComponent
  ]
})
export class ComponentsModule { }
