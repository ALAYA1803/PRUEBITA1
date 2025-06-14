import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from "@angular/material/icon";
import { DashboardStats } from '../../model/dashboard-stats.entity';
import { Reservation } from '../../model/reservation.entity';
import { Bike } from '../../model/bike.entity';
import { DashboardService } from '../../service/dashboard.service';
import { ReservationService } from '../../service/reservation.service';

export interface RecentActivity {
  type: 'reservation' | 'review' | 'cancellation';
  person: string;
  bikeName: string;
  timestamp: Date;
}

@Component({
  selector: 'app-owner-home-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, CurrencyPipe, MatIconModule, RouterLink, DatePipe],
  templateUrl: './owner-home.page.html',
  styleUrls: ['./owner-home.page.css']
})
export class OwnerHomePage implements OnInit {
  ownerName: string = 'Ana';
  stats!: DashboardStats;
  pendingReservations: Reservation[] = [];
  recentActivities: RecentActivity[] = [];
  topBikes: Bike[] = [];

  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  private reservationService = inject(ReservationService);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.stats = new DashboardStats({
      monthlyIncome: 750.50,
      pendingReservationsCount: 2,
      activeBikesCount: 8,
      ownerRating: 4.9
    });

    this.pendingReservations = [
      new Reservation({ id: 1, renterName: 'Carlos Villa', bikeName: 'BMX Pro', date: new Date('2025-06-14T14:00:00'), status: 'Pending' }),
      new Reservation({ id: 2, renterName: 'Lucía Fernández', bikeName: 'Vintage Verde', date: new Date('2025-06-15T10:00:00'), status: 'Pending' }),
      new Reservation({ id: 3, renterName: 'Lucía Fernández', bikeName: 'Vintage Verde', date: new Date('2025-06-15T10:00:00'), status: 'Pending' }),
    ];

    this.recentActivities = [
      { type: 'reservation',  person: 'Javier Soto',   bikeName: 'Mountain X',    timestamp: new Date() },
      { type: 'review',       person: 'Maria Rojas',   bikeName: 'BMX Pro',       timestamp: new Date(new Date().getTime() - 3 * 60 * 60 * 1000) },
      { type: 'cancellation', person: 'Pedro Gomez',   bikeName: 'Vintage Verde', timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) }
    ];

    this.topBikes = [
      new Bike({ id: 101, model: 'BMX Pro', type: 'BMX', rentalsThisMonth: 15, imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp' }),
      new Bike({ id: 102, model: 'Vintage Verde', type: 'Urbana', rentalsThisMonth: 12, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdDydP4N9WKFYaT6cZoxxGCw5kL2BVGseLww&s' }),
      new Bike({ id: 103, model: 'Mountain X', type: 'Montañera', rentalsThisMonth: 9, imageUrl: 'https://cuponassets.cuponatic-latam.com/backendPe/uploads/imagenes_descuentos/102109/f001f03a7ed89e3960ac9e197306a6d70f138fac.XL2.jpg' }),
      new Bike({ id: 104, model: 'Mountain X', type: 'Montañera', rentalsThisMonth: 9, imageUrl: 'https://cuponassets.cuponatic-latam.com/backendPe/uploads/imagenes_descuentos/102109/f001f03a7ed89e3960ac9e197306a6d70f138fac.XL2.jpg' }),
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
