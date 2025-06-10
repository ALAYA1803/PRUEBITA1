// renter-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet }  from '@angular/router';
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import { SidebarComponent }  from '../../../shared/components/sidebar/sidebar.component';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component'; // Asegúrate que la ruta sea correcta

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
    LanguageSwitcherComponent
  ],
  templateUrl: './renter-layout.component.html',
  styleUrls: ['./renter-layout.component.css']
})
export class RenterLayoutComponent {}
