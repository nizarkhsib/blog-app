import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddArticleComponent implements OnInit, OnDestroy {
  html: '';
  loading = false;
  alive = true;
  editor: Editor;
  articleForm: FormGroup;
  file: File;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    // [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  tags: string[] = [];

  @ViewChild('tagsInput') tagsInput: ElementRef<HTMLInputElement>;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private articlesService: ArticlesService) {

  }

  ngOnInit(): void {

    this.articleForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    this.editor = new Editor();

  }

  // convenience getter for easy access to form fields
  get f(): any { return this.articleForm.controls; }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.alive = false;
    this.editor.destroy();
  }

  saveArticle() {
    console.log('ctrl', this.tagsCtrl.value);
    console.log('tags array', this.tags);
    const loggedUser = this.authenticationService.currentUserSubject.getValue();

    const article: Article = {
      tags: this.tags,
      title: this.formValue.title,
      // description: string,
      content: this.formValue.content,
      // datePublished: number,
      userId: loggedUser._id
    };
    this.articlesService.postWithPhoto(article, this.file).subscribe(
      () => {
        this.router.navigate(['../']);
      }
    )
  }

  private get formValue() {
    return this.articleForm.value;
  }

  onSelect(event) {
    this.file = event.addedFiles[0];
  }

  onRemove(event) {
    this.file = null;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagsCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

}
