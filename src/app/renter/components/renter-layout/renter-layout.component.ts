import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { SidebarComponent, MenuItem } from '../../../shared/components/sidebar/sidebar.component';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CurrentUser, CurrentUserService } from '../../../shared/services/current-user.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-renter-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, SidebarComponent, MatSidenavModule,
    MatToolbarModule, MatIconModule, MatButtonModule, LanguageSwitcherComponent,
    TranslateModule, MatMenuModule, MatBadgeModule, RouterLink, MatDividerModule
  ],
  templateUrl: './renter-layout.component.html',
  styleUrls: ['./renter-layout.component.css']
})
export class RenterLayoutComponent implements OnInit {
  pageTitle = '';
  renterMenuItems: MenuItem[] = [
    { label: 'Sidebar.Home',    icon: 'home',    link: '/renter/home' },
    { label: 'Sidebar.Map',     icon: 'map',     link: '/renter/map' },
    { label: 'Sidebar.Profile', icon: 'person',  link: '/renter/profile' },
    { label: 'Sidebar.Support', icon: 'headset', link: '/renter/support' }
  ];
  private router = inject(Router);
  private translate = inject(TranslateService);
  private currentUserService = inject(CurrentUserService);
  private notificationService = inject(NotificationService);
  currentUser$: Observable<CurrentUser | null>;
  notifications$: Observable<any[]>;
  unreadCount$: Observable<number>;

  constructor() {
    this.currentUser$ = this.currentUserService.currentUser$;
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {
    if (!this.currentUserService.getCurrentUserSnapshot()) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.currentUserService.loadUser(userId).subscribe();
      }
    }
    this.updateTitleOnRouteChange();
  }
  onNotificationsClosed(): void {
    this.notificationService.markAllAsRead();
  }
  onLogout(): void {
    localStorage.removeItem('userId');
    this.router.navigateByUrl('/login');
  }
  private updateTitleOnRouteChange(): void {
    const updateTitle = () => {
      const currentRoute = this.renterMenuItems.find(item => this.router.url.includes(item.link));
      this.pageTitle = currentRoute ? this.translate.instant(currentRoute.label) : '';
    };
    updateTitle();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(updateTitle);
  }
}
