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

  postWithPhoto(resource: Article, file: File): Observable<Article> {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(resource).forEach(key => {
      formData.append(key, resource[key]);
    });
    return this.httpClient.post(`${this.API}/with-photo`, formData);
  }

  getPaginatedList(pageSize: number, skip: number): Observable<PaginatedResult<Article>> {
    let params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('skip', skip.toString());

    return this.httpClient
      .get<PaginatedResult<Article>>(`${this.API}?${params.toString().trim()}`).pipe(
        map(paginatedResult => {
          paginatedResult.results
            .forEach(
              article => article.filePath = `${environment.apiUrl}${article.filePath}`
            );
          return paginatedResult;
        })
      )


  }

  get(id: string | number): Observable<Article> {
    return this.httpClient.get<Article>(`${this.API}/${id}`)
      .pipe(
        map((article: Article) => {
          article.filePath = `${environment.apiUrl}${article.filePath}`
          return article;
        })
      );
  }

}