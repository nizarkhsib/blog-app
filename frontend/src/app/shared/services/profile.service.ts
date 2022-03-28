import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Profile, ProfileDto } from '../models/profile';
import { ResourceService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends ResourceService<Profile>{

  private readonly API = environment.apiUrl + this.getResourceUrl();

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  getProfileByUserId(userId: string): Observable<Profile> {
    return this.httpClient.get<Profile>(`${this.API}/${userId}`).pipe(
      map(
        profile => {
          profile.photoPath = `${environment.apiUrl}${profile.photoPath}`
          return { ...profile };
        }
      )
    );;
  }

  updateWithPhoto(
    profileId: string,
    resource: ProfileDto,
    file: File
  ): Observable<Profile> {

    const formData = new FormData();
    formData.append('file', file);

    Object.keys(resource).forEach(key => {
      formData.append(key, resource[key]);
    });

    return this.httpClient.put<Profile>(`${this.API}/${profileId}`, formData).pipe(
      map(
        profile => {
          profile.photoPath = `${environment.apiUrl}${profile.photoPath}`;
          return { ...profile };
        }
      )
    );;;
  }

  getResourceUrl(): string {
    return 'profile'
  }
}
