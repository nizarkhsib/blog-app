import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from './paginated-result';

@Injectable({
  providedIn: 'root'
})
export abstract class ResourceService<T> {
  private readonly APIUrl = environment.apiUrl + this.getResourceUrl();

  constructor(protected httpClient: HttpClient) {
  }

  abstract getResourceUrl(): string;

  getPaginatedList(pageSize: number, skip: number): Observable<PaginatedResult<T>> {
    let params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('skip', skip.toString());

    return this.httpClient.get<PaginatedResult<T>>(`${this.APIUrl}?${params.toString().trim()}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getList(): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.APIUrl}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  get(id: string | number): Observable<T> {
    return this.httpClient.get<T>(`${this.APIUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  post(resource: T): Observable<any> {
    return this.httpClient.post(`${this.APIUrl}`, resource)
      .pipe(
        catchError(this.handleError)
      );
  }

  delete(id: string | number): Observable<any> {
    return this.httpClient.delete(`/${this.APIUrl}}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  update(resource: T) {
    return this.httpClient.put(`/${this.APIUrl}}`, resource)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    // Handle the HTTP error here
    return throwError('Something wrong happened');
  }
}