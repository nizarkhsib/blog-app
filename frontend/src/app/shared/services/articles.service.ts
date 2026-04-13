import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Article } from "../models/article";
import { ResourceService } from "./backend.service";
import { PaginatedResult } from "./paginated-result";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService extends ResourceService<Article> {

  private readonly API = environment.apiUrl + this.getResourceUrl();

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  getResourceUrl(): string {
    return 'articles';
  }

  toggleLike(articleId: string): Observable<{ liked: boolean; likes: number }> {
    return this.httpClient.post<{ liked: boolean; likes: number }>(`${this.API}/${articleId}/like`, {});
  }

  isLiked(articleId: string): Observable<{ liked: boolean }> {
    return this.httpClient.get<{ liked: boolean }>(`${this.API}/${articleId}/liked`);
  }

  /**
   * Create a new article
   */
  createArticle(article: Partial<Article>, coverImage?: File | null): Observable<Article> {
    if (coverImage) {
      const formData = this.buildFormData(article, coverImage);
      return this.httpClient.post<Article>(`${this.API}`, formData);
    }

    return this.httpClient.post<Article>(`${this.API}`, article);
  }

  /**
   * Get user's articles
   */
  getUserArticles(pageIndex: number = 0, pageSize: number = 10): Observable<PaginatedResult<Article>> {
    let params = new HttpParams()
      .set('skip', (pageIndex * pageSize).toString())
      .set('limit', pageSize.toString());

    return this.httpClient.get<PaginatedResult<Article>>(`${this.API}/user/me?${params.toString()}`);
  }

  /**
   * Get published articles
   */
  getPublishedArticles(pageIndex: number = 0, pageSize: number = 10): Observable<PaginatedResult<Article>> {
    let params = new HttpParams()
      .set('skip', (pageIndex * pageSize).toString())
      .set('limit', pageSize.toString());

    return this.httpClient.get<PaginatedResult<Article>>(`${this.API}/published?${params.toString()}`);
  }

  /**
   * Search articles
   */
  searchArticles(query: string, pageIndex: number = 0, pageSize: number = 10): Observable<PaginatedResult<Article>> {
    let params = new HttpParams()
      .set('q', query)
      .set('skip', (pageIndex * pageSize).toString())
      .set('limit', pageSize.toString());

    return this.httpClient.get<PaginatedResult<Article>>(`${this.API}/search`, { params });
  }

  /**
   * Get articles by writer ID (published articles only)
   */
  getArticlesByWriter(writerId: string, pageIndex: number = 0, pageSize: number = 10): Observable<PaginatedResult<Article>> {
    let params = new HttpParams()
      .set('skip', (pageIndex * pageSize).toString())
      .set('limit', pageSize.toString());

    return this.httpClient.get<PaginatedResult<Article>>(`${this.API}/writer/${writerId}?${params.toString()}`);
  }

  /**
   * Get article by ID
   */
  getArticleById(id: string): Observable<Article> {
    return this.httpClient.get<Article>(`${this.API}/${id}`);
  }

  /**
   * Update an article
   */
  updateArticle(id: string, article: Partial<Article>, coverImage?: File | null): Observable<Article> {
    if (coverImage) {
      const formData = this.buildFormData(article, coverImage);
      return this.httpClient.put<Article>(`${this.API}/${id}`, formData);
    }

    return this.httpClient.put<Article>(`${this.API}/${id}`, article);
  }

  /**
   * Archive an article
   */
  archiveArticle(id: string): Observable<Article> {
    return this.httpClient.put<Article>(`${this.API}/${id}/archive`, {});
  }

  /**
   * Unarchive an article
   */
  unarchiveArticle(id: string): Observable<Article> {
    return this.httpClient.put<Article>(`${this.API}/${id}/unarchive`, {});
  }

  /**
   * Unpublish an article (revert to draft)
   */
  unpublishArticle(id: string): Observable<Article> {
    return this.httpClient.put<Article>(`${this.API}/${id}/unpublish`, {});
  }

  /**
   * Delete an article
   */
  deleteArticle(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API}/${id}`);
  }

  /**
   * Post article with photo (legacy support)
   */
  postWithPhoto(resource: Article, file: File): Observable<Article> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    Object.keys(resource).forEach(key => {
      formData.append(key, (resource as any)[key]);
    });
    return this.httpClient.post(`${this.API}/with-photo`, formData);
  }

  /**
   * Get paginated article list (legacy support)
   */
  getPaginatedList(pageSize: number, skip: number): Observable<PaginatedResult<Article>> {
    let params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('skip', skip.toString());

    return this.httpClient
      .get<PaginatedResult<Article>>(`${this.API}?${params.toString().trim()}`).pipe(
        map(paginatedResult => {
          paginatedResult.results.forEach(article => {
            this.normalizeCoverImage(article);
          });
          return paginatedResult;
        })
      );
  }

  /**
   * Get single article (legacy support)
   */
  get(id: string | number): Observable<Article> {
    return this.httpClient.get<Article>(`${this.API}/${id}`)
      .pipe(
        map((article: Article) => {
          this.normalizeCoverImage(article);
          return article;
        })
      );
  }

  private buildFormData(article: Partial<Article>, coverImage: File): FormData {
    const formData = new FormData();
    formData.append('article', JSON.stringify(article));
    formData.append('file', coverImage, coverImage.name);
    return formData;
  }

  private normalizeCoverImage(article: Article): Article {
    if (!article || !article.coverImage) {
      return article;
    }

    if (typeof article.coverImage === 'string') {
      if (!article.coverImage.startsWith('data:') && !article.coverImage.startsWith('http')) {
        article.coverImage = `${environment.apiUrl}${article.coverImage}`;
      }
      return article;
    }

    const cover: any = article.coverImage;
    let mimeType = cover.contentType || 'image/jpeg';
    let rawData: any = cover.data;

    if (rawData && rawData.data && Array.isArray(rawData.data)) {
      rawData = rawData.data;
    }

    if (Array.isArray(rawData)) {
      const chunkSize = 0x8000;
      let binary = '';
      for (let i = 0; i < rawData.length; i += chunkSize) {
        binary += String.fromCharCode(...rawData.slice(i, i + chunkSize));
      }
      article.coverImage = `data:${mimeType};base64,${btoa(binary)}`;
    } else if (typeof rawData === 'string') {
      article.coverImage = `data:${mimeType};base64,${rawData}`;
    }

    return article;
  }

}