import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentDto, Comment } from '../models/comment.dto';
import { ResourceService } from './backend.service';
import { PaginatedResult } from './paginated-result';

@Injectable({
  providedIn: 'root'
})
export class CommentsService extends ResourceService<CommentDto> {

  private readonly API = environment.apiUrl + this.getResourceUrl();

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  getResourceUrl(): string {
    return 'comments';
  }

  getCommentsByArticleId(articleId: string, pageSize: number, skip: number):
    Observable<PaginatedResult<Comment>> {

    let params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('skip', skip.toString());

    return this.httpClient
      .get<PaginatedResult<Comment>>(`${this.API}/${articleId}?${params.toString().trim()}`);
  }
}
