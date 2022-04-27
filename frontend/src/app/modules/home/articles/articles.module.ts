import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesRoutingModule } from './articles-routing.module';
import { FormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxEditorModule } from 'ngx-editor';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ArticleContentComponent } from './article-content/article-content.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { HomeRoutingModule } from '../home-routing.module';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ArticlesListComponent,
    ArticleContentComponent
  ],
  imports: [
    FormsModule,
    // ReactiveFormsModule,
    ArticlesRoutingModule,
    NgxEditorModule,
    MatInputModule,
    NgxDropzoneModule,
    CommonModule,
    MatSidenavModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    ComponentsModule,
    HomeRoutingModule,
    RouterModule,
    MatPaginatorModule,
    MatCardModule,
    FlexLayoutModule,
    MatSliderModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class ArticlesModule { }
