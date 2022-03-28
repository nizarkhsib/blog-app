import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserSignupDto } from '../models/user.signup';
import { LoggedUser } from '../models/logged-user';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private readonly url = environment.apiUrl;
  currentUserSubject: BehaviorSubject<LoggedUser> = new BehaviorSubject(null);
  public currentUser: Observable<LoggedUser | null>;

  constructor(private router: Router, private http: HttpClient) {
    const currentUser = JSON.parse(localStorage.getItem('token'));
    if (currentUser)
      this.currentUserSubject.next(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoggedUser {
    return this.currentUserSubject.value;
  }

  signIn(email: string, password: string): Observable<LoggedUser> {
    return this.http
      .post<LoggedUser>(`${this.url}auth/signin`, { email, password })
      .pipe(
        map(user => {
          // store user details and jwt token in local storage 
          // to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(user));
          // this.currentUserSubject.next(user.token);
          return user;
        })
      );
  }

  signUp(user: UserSignupDto): Observable<UserSignupDto> {
    return this.http.post<User>(`${this.url}auth/signup`, user);
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

}
