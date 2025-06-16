import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSource = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSource.asObservable();

  unreadCount$ = this.notifications$.pipe(map(notifications => notifications.length));

  constructor() { }

  setNotifications(notifications: any[]): void {
    this.notificationsSource.next(notifications);
  }

  markAllAsRead(): void {
    this.notificationsSource.next([]);
  }
  clearNotifications(): void {
    this.notificationsSource.next([]);
  }
}
