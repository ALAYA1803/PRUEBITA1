import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet }  from '@angular/router';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';

// Tu sidebar (solo nav-list)
import { SidebarComponent }  from '../../../shared/components/sidebar/sidebar.component';

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
    SidebarComponent
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="custom-sidenav">
        <app-sidebar></app-sidebar>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar-fixed">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>BikeShare</span>
          <span class="spacer"></span>
        </mat-toolbar>

        <main class="layout-main">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./renter-layout.component.css']
})
export class RenterLayoutComponent {}
