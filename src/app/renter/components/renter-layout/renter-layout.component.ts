import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// Imports de Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

// Imports de componentes y servicios compartidos
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
  // El menú de Renter se mantiene, es específico de este layout
  renterMenuItems: MenuItem[] = [
    { label: 'Sidebar.Home',    icon: 'home',    link: '/renter/home' },
    { label: 'Sidebar.Map',     icon: 'map',     link: '/renter/map' },
    { label: 'Sidebar.Profile', icon: 'person',  link: '/renter/profile' },
    { label: 'Sidebar.Support', icon: 'headset', link: '/renter/support' }
  ];

  // Inyección de dependencias
  private router = inject(Router);
  private translate = inject(TranslateService);
  private currentUserService = inject(CurrentUserService);
  private notificationService = inject(NotificationService);

  // Observables para la plantilla
  currentUser$: Observable<CurrentUser | null>;
  notifications$: Observable<any[]>;
  unreadCount$: Observable<number>;

  constructor() {
    // Conectamos las propiedades a los observables de los servicios
    this.currentUser$ = this.currentUserService.currentUser$;
    this.notifications$ = this.notificationService.notifications$;
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {
    // Carga los datos del usuario si no están ya en el servicio (ej. al refrescar)
    if (!this.currentUserService.getCurrentUserSnapshot()) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.currentUserService.loadUser(userId).subscribe();
      }
    }
    this.updateTitleOnRouteChange();
  }

  // Se ejecuta cuando el menú de notificaciones se cierra para limpiar el contador
  onNotificationsClosed(): void {
    this.notificationService.markAllAsRead();
  }

  // Cierra sesión y redirige al login
  onLogout(): void {
    localStorage.removeItem('userId');
    this.router.navigateByUrl('/login');
  }

  // Actualiza el título de la página en el toolbar según la ruta activa
  private updateTitleOnRouteChange(): void {
    const updateTitle = () => {
      const currentRoute = this.renterMenuItems.find(item => this.router.url.includes(item.link));
      this.pageTitle = currentRoute ? this.translate.instant(currentRoute.label) : '';
    };
    updateTitle();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(updateTitle);
  }
}
