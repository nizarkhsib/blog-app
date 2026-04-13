import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { Notification } from '../models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private socket: Socket | null = null;
  private readonly apiUrl = environment.apiUrl + 'notifications';

  notifications$ = new BehaviorSubject<Notification[]>([]);
  unreadCount$ = new BehaviorSubject<number>(0);
  totalCount$ = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {
    this.authService.currentUserSubject.subscribe(user => {
      if (user?.token) {
        this.connect(user.token);
        this.loadNotifications(0, 5);
        this.loadUnreadCount();
      } else {
        this.disconnect();
        this.notifications$.next([]);
        this.unreadCount$.next(0);
      }
    });
  }

  private connect(token: string) {
    this.disconnect();

    const wsUrl = environment.apiUrl.replace(/\/$/, '');
    this.socket = io(`${wsUrl}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('[Notifications] WebSocket connected');
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('[Notifications] WebSocket connect error:', err.message);
    });

    this.socket.on('notification', (notification: Notification) => {
      const current = this.notifications$.value;
      this.notifications$.next([notification, ...current]);
      this.unreadCount$.next(this.unreadCount$.value + 1);
    });
  }

  private disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  loadNotifications(skip = 0, limit = 20): void {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    this.http.get<{ results: Notification[]; count: number; unreadCount: number }>(
      this.apiUrl, { params }
    ).subscribe({
      next: (data) => {
        if (skip === 0) {
          this.notifications$.next(data.results);
        } else {
          this.notifications$.next([...this.notifications$.value, ...data.results]);
        }
        this.unreadCount$.next(data.unreadCount);
        this.totalCount$.next(data.count);
      },
    });
  }

  loadUnreadCount(): void {
    this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`).subscribe({
      next: (data) => this.unreadCount$.next(data.count),
    });
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): void {
    this.http.put(`${this.apiUrl}/read-all`, {}).subscribe({
      next: () => {
        const updated = this.notifications$.value.map(n => ({ ...n, read: true }));
        this.notifications$.next(updated);
        this.unreadCount$.next(0);
      },
    });
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
