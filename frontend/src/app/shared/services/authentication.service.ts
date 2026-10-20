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
  currentUserSubject: BehaviorSubject<LoggedUser | null> = new BehaviorSubject<LoggedUser | null>(null);
  public currentUser: Observable<LoggedUser | null>;

  constructor(private router: Router, private http: HttpClient) {
    const currentUserData = localStorage.getItem('token');
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
    if (currentUser)
      this.currentUserSubject.next(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoggedUser | null {
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
    return this.http.post<User>(`${this.url}/auth/signup`, user);
  }

  /**
   * Handle OAuth callback and token storage
   */
  handleOAuthCallback(token: string): void {
    if (token) {
      // Decode token and store user info
      const user = this.decodeToken(token);
      const loggedUser: LoggedUser = {
        ...user,
        token
      };
      localStorage.setItem('token', JSON.stringify(loggedUser));
      this.currentUserSubject.next(loggedUser);
    }
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  /**
   * Initiate Google OAuth login
   */
  loginWithGoogle(): void {
    const backendUrl = environment.apiUrl.replace('/api/', '');
    window.location.href = `${backendUrl}auth/google`;
  }

  /**
   * Initiate Facebook OAuth login
   */
  loginWithFacebook(): void {
    const backendUrl = environment.apiUrl.replace('/api/', '');
    window.location.href = `${backendUrl}auth/facebook`;
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

}
