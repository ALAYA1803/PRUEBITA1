// renter-layout.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd }  from '@angular/router';
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import { SidebarComponent }  from '../../../shared/components/sidebar/sidebar.component';
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

  private router    = inject(Router);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    const updateTitle = () => {
      const url = this.router.url;
      if (url.includes('/renter/home')) {
        this.pageTitle = this.translate.instant('Sidebar.Home');
      } else if (url.includes('/renter/map')) {
        this.pageTitle = this.translate.instant('Sidebar.Map');
      } else if (url.includes('/renter/profile')) {
        this.pageTitle = this.translate.instant('Sidebar.Profile');
      } else if (url.includes('/renter/support')) {
        this.pageTitle = this.translate.instant('Sidebar.Support');
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
