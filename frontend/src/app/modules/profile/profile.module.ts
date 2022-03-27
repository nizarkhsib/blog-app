import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxEditorModule } from 'ngx-editor';
import { MatButtonModule } from '@angular/material/button';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
    MatButtonModule,
    MatInputModule,
    ComponentsModule,
    MatDialogModule,
    FlexLayoutModule,
    NgxDropzoneModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class ProfileModule { }
