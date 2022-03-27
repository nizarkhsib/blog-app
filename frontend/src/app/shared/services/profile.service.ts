import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profile } from '../models/profile';
import { ResourceService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends ResourceService<Profile>{

  private readonly API = environment.apiUrl + this.getResourceUrl();

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  getProfileByUserId(userId: string):
    Observable<Profile> {

    return this.httpClient.get<Profile>(`${this.API}/${userId}`);
  }

  getResourceUrl(): string {
    return 'profile'
  }
}
