import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-owner-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="layout-container">
      <app-sidebar></app-sidebar>
      <main class="layout-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./owner-layout.component.css']
})
export class OwnerLayoutComponent {}
