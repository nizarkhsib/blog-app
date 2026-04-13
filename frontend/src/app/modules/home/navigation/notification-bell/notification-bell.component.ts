import { Component, OnDestroy, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Notification } from 'src/app/shared/models/notification';

@Component({
  selector: 'app-notification-bell',
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss'],
  standalone: false,
  animations: [
    trigger('panelAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px) scale(0.96)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(-6px) scale(0.97)' })),
      ]),
    ]),
  ],
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  totalCount = 0;
  showPanel = false;
  loadingMore = false;
  private readonly pageSize = 5;

  private subs: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private elRef: ElementRef,
  ) {}

  ngOnInit() {
    this.subs.push(
      this.notificationService.notifications$.subscribe(n => {
        this.notifications = n;
        this.loadingMore = false;
      }),
      this.notificationService.unreadCount$.subscribe(c => this.unreadCount = c),
      this.notificationService.totalCount$.subscribe(c => this.totalCount = c),
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  togglePanel() {
    this.showPanel = !this.showPanel;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showPanel = false;
    }
  }

  onMarkAllRead() {
    this.notificationService.markAllAsRead();
  }

  get hasMore(): boolean {
    return this.notifications.length < this.totalCount;
  }

  loadMore() {
    if (this.loadingMore || !this.hasMore) return;
    this.loadingMore = true;
    this.notificationService.loadNotifications(this.notifications.length, this.pageSize);
  }

  onClickNotification(n: Notification) {
    if (!n.read) {
      this.notificationService.markAsRead(n._id).subscribe(() => {
        n.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.notificationService.unreadCount$.next(this.unreadCount);
      });
    }
    this.showPanel = false;
    this.router.navigate(['/article', n.article._id]);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'like': return 'favorite';
      case 'comment': return 'chat_bubble';
      case 'comment_on_commented': return 'forum';
      default: return 'notifications';
    }
  }

  getIconClass(type: string): string {
    return `icon-${type}`;
  }

  getTimeAgo(dateStr: string): string {
    const now = Date.now();
    const date = new Date(dateStr).getTime();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }
}
