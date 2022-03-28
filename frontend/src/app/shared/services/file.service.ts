import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(protected httpClient: HttpClient) { }

  getFile(url): Observable<File> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.httpClient.get<File>(url,
      { headers: headers, responseType: 'blob' as 'json' }
    );
  }

}
