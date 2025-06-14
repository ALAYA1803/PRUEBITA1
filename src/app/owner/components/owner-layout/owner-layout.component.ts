import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarComponent, MenuItem } from '../../../shared/components/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LanguageSwitcherComponent } from "../../../shared/components/language-switcher/language-switcher.component";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-owner-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    LanguageSwitcherComponent,
    TranslateModule
  ],
  templateUrl: './owner-layout.component.html',
  styleUrls: ['./owner-layout.component.css']
})
export class OwnerLayoutComponent implements OnInit {
  pageTitle = '';

  ownerMenuItems: MenuItem[] = [
    { label: 'Sidebar.Home',         icon: 'home',            link: '/owner/home' },
    { label: 'Sidebar.MyBikes',      icon: 'directions_bike', link: '/owner/my-bikes' },
    { label: 'Sidebar.Reservations', icon: 'event_note',      link: '/owner/reservations' },
    { label: 'Sidebar.Profile',      icon: 'person',          link: '/owner/profile' },
    { label: 'Sidebar.Support',      icon: 'headset',         link: '/owner/support' }
  ];

  private router    = inject(Router);
  private translate = inject(TranslateService);
  ngOnInit(): void {
    const updateTitle = () => {
      const currentRoute = this.ownerMenuItems.find(item => this.router.url.includes(item.link));
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
