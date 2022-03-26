import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Editor, Validators } from 'ngx-editor';
import { BehaviorSubject } from 'rxjs';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

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
    const loggedUser = this.authenticationService.currentUserSubject.getValue();

    const article: Article = {
      title: this.formValue.title,
      // description: string,
      content: this.formValue.content,
      // datePublished: number,
      userId: loggedUser._id
    };
    this.articlesService.postWithPhoto(article, this.file).subscribe(
      () => {
        // this.router.navigate(['../']);
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
}
