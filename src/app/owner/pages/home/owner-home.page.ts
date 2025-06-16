import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from "@angular/material/icon";
import { NotificationService } from '../../../shared/services/notification.service';
import { CurrentUserService } from '../../../shared/services/current-user.service';
import { DashboardStats } from '../../model/dashboard-stats.entity';
import { Reservation } from '../../model/reservation.entity';
import { Bike } from '../../model/bike.entity';
export interface RecentActivity {
  type: 'reservation' | 'review' | 'cancellation';
  person: string;
  bikeName: string;
  timestamp: Date;
}

@Component({
  selector: 'app-owner-home-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CurrencyPipe,
    MatIconModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './owner-home.page.html',
  styleUrls: ['./owner-home.page.css']
})
export class OwnerHomePage implements OnInit {
  ownerName = '';
  stats!: DashboardStats;
  pendingReservations: Reservation[] = [];
  recentActivities: RecentActivity[] = [];
  topBikes: Bike[] = [];
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private currentUserService = inject(CurrentUserService);

  ngOnInit(): void {
    this.fetchOwnerName();
    this.loadDashboardData();
  }
  private fetchOwnerName(): void {
    this.currentUserService.currentUser$.subscribe(user => {
      if (user) {
        this.ownerName = user.fullName;
      }
    });
  }

  private loadDashboardData(): void {
    this.stats = new DashboardStats({
      monthlyIncome: 750.50,
      pendingReservationsCount: 2,
      activeBikesCount: 8,
      ownerRating: 4.9
    });
    this.pendingReservations = [
      new Reservation({ id: 1, renterName: 'Carlos Villa', bikeName: 'BMX Pro', date: new Date('2025-06-17T14:00:00'), status: 'Pending' }),
      new Reservation({ id: 2, renterName: 'Lucía Fernández', bikeName: 'Vintage Verde', date: new Date('2025-06-18T10:00:00'), status: 'Pending' }),
      new Reservation({ id: 3, renterName: 'Javier Soto', bikeName: 'Mountain X', date: new Date('2025-06-19T09:00:00'), status: 'Pending' })
    ];
    const allActivities: RecentActivity[] = [
      { type: 'reservation',  person: 'Javier Soto',   bikeName: 'Mountain X',    timestamp: new Date() },
      { type: 'review',       person: 'Maria Rojas',   bikeName: 'BMX Pro',       timestamp: new Date(Date.now() -  3 * 3600_000) },
      { type: 'cancellation', person: 'Pedro Gomez',   bikeName: 'Vintage Verde', timestamp: new Date(Date.now() - 24 * 3600_000) },
      { type: 'reservation',  person: 'Ana Ruiz',      bikeName: 'City Light',    timestamp: new Date(Date.now() - 48 * 3600_000) },
      { type: 'review',       person: 'Luis Herrera',  bikeName: 'Urban Glide',   timestamp: new Date(Date.now() - 72 * 3600_000) },
      { type: 'reservation',  person: 'Carla Vega',    bikeName: 'Trail Blazer',  timestamp: new Date(Date.now() - 96 * 3600_000) },
      { type: 'cancellation', person: 'Andrés Patiño', bikeName: 'Speedster',     timestamp: new Date(Date.now() - 120 * 3600_000) },
    ];
    this.recentActivities = allActivities.slice(0, 7);
    this.notificationService.setNotifications(this.recentActivities);
    this.topBikes = [
      new Bike({ id: 101, model: 'BMX Pro',        type: 'BMX',       rentalsThisMonth: 15, imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp' }),
      new Bike({ id: 102, model: 'Vintage Verde',  type: 'Urbana',    rentalsThisMonth: 12, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdDydP4N9WKFYaT6cZoxxGCw5kL2BVGseLww&s' }),
      new Bike({ id: 103, model: 'Mountain X',     type: 'Montañera', rentalsThisMonth:  9, imageUrl: 'https://cuponassets.cuponatic-latam.com/backendPe/uploads/imagenes_descuentos/102109/f001f03a7ed89e3960ac9e197306a6d70f138fac.XL2.jpg' }),
      new Bike({ id: 104, model: 'City Light',     type: 'Urbana',    rentalsThisMonth:  8, imageUrl: 'https://via.placeholder.com/220x140?text=City+Light' }),
    ];
  }

  navigateToAddBike(): void {
    this.router.navigate(['/owner/my-bikes']);
  }

  acceptReservation(id: number): void {
    console.log(`Aceptando reserva con ID: ${id}`);
  }

  declineReservation(id: number): void {
    console.log(`Rechazando reserva con ID: ${id}`);
  }
}
