import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { Article } from 'src/app/shared/models/article';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class AddArticleComponent implements OnInit, OnDestroy {
  html: string = '';
  loading = false;
  alive = true;
  editor!: Editor;
  articleForm!: FormGroup;
  coverImage: File | null = null;
  coverImagePreviewUrl: string | null = null;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  tags: string[] = [];
  isEditMode = false;
  articleId: string = '';

  @ViewChild('tagsInput') tagsInput!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private articlesService: ArticlesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.articleForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      status: ['draft', Validators.required]
    });

    this.editor = new Editor();

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.articleId = params['id'];
        this.loadArticle(this.articleId);
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.editor.destroy();
  }

  get f(): any {
    return this.articleForm.controls;
  }

  /**
   * Load article for editing
   */
  loadArticle(articleId: string): void {
    this.articlesService.getArticleById(articleId).subscribe(
      (article: Article) => {
        this.articleForm.patchValue({
          title: article.title,
          description: article.description,
          content: article.content,
          status: article.status
        });
        this.tags = article.tags || [];
        if (article.coverImage) {
          this.coverImagePreviewUrl = `${environment.apiUrl}articles/${articleId}/cover`;
        }
      },
      error => console.error('Error loading article', error)
    );
  }

  /**
   * Save article (as draft or publish)
   */
  saveArticle(): void {
    if (this.articleForm.invalid) {
      this.snackBar.open('Please fill all required fields and ensure content is at least 50 characters', 'Close', { duration: 4000, panelClass: 'snackbar-error' });
      return;
    }

    this.loading = true;
    const loggedUser = this.authenticationService.currentUserSubject.getValue();

    const article: Partial<Article> = {
      title: this.formValue.title,
      description: this.formValue.description,
      content: this.formValue.content,
      status: this.formValue.status,
      tags: this.tags
    };

    const request = this.isEditMode
      ? this.articlesService.updateArticle(this.articleId, article, this.coverImage)
      : this.articlesService.createArticle(article, this.coverImage);

    request.subscribe(
      () => {
        this.loading = false;
        this.snackBar.open('Article saved successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/write-dashboard/articles']);
      },
      error => {
        this.loading = false;
        console.error('Error saving article', error);
        this.snackBar.open('Error saving article', 'Close', { duration: 4000, panelClass: 'snackbar-error' });
      }
    );
  }

  /**
   * Save as draft and continue editing
   */
  saveDraft(): void {
    const statusControl = this.articleForm.get('status');
    if (statusControl) {
      statusControl.setValue('draft');
    }
    this.saveArticle();
  }

  /**
   * Publish article
   */
  publishArticle(): void {
    const statusControl = this.articleForm.get('status');
    if (statusControl) {
      statusControl.setValue('published');
    }
    this.saveArticle();
  }

  private get formValue() {
    return this.articleForm.value;
  }

  /**
   * Handle cover image upload
   */
  onSelectCoverImage(event: any): void {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      this.coverImage = file;
      const reader = new FileReader();
      reader.onload = () => this.coverImagePreviewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onRemoveCoverImage(): void {
    this.coverImage = null;
    this.coverImagePreviewUrl = null;
  }

  /**
   * Add tag from chip input
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      if (this.tags.indexOf(value) === -1) {
        this.tags.push(value);
      }
      // Clear the input value
      if (event.chipInput) {
        event.chipInput.clear();
      }
    }
  }

  /**
   * Remove tag
   */
  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  /**
   * Handle tag autocomplete selection
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.tags.indexOf(event.option.viewValue) === -1) {
      this.tags.push(event.option.viewValue);
    }
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  /**
   * Navigate back to articles list
   */
  goBack(): void {
    this.router.navigate(['write-dashboard/articles']);
  }
}
