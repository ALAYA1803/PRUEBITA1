import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd }  from '@angular/router';
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import { SidebarComponent, MenuItem }  from '../../../shared/components/sidebar/sidebar.component';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-renter-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent,
    LanguageSwitcherComponent,
    TranslateModule
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

  private router    = inject(Router);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    const updateTitle = () => {
      const currentRoute = this.renterMenuItems.find(item => this.router.url.includes(item.link));
      if (currentRoute) {
        this.pageTitle = this.translate.instant(currentRoute.label);
      } else {
        this.pageTitle = '';
      }
    };

    updateTitle();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(updateTitle);
  }
}
