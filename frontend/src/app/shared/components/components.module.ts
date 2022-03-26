import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { ArticleItemComponent } from './article-item/article-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { CommentsComponent } from './article-item/comments/comments.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ListComponent,
    ArticleItemComponent,
    CommentsComponent,
    ProfileCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  exports: [
    ListComponent,
    ArticleItemComponent,
    ProfileCardComponent
  ]
})
export class ComponentsModule { }
