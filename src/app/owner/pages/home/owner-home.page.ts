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
import { DashboardService } from '../../service/dashboard.service';
import { ReservationService } from '../../service/reservation.service';
import { BikeService } from '../../service/bike.service';
import { forkJoin } from 'rxjs';
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
  loading = false;
  error = false;
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private currentUserService = inject(CurrentUserService);
  private dashboardService = inject(DashboardService);
  private reservationService = inject(ReservationService);
  private bikeService = inject(BikeService);

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
    this.loading = true;
    this.error = false;
    forkJoin({
      stats: this.dashboardService.getDashboardStats(),
      reservations: this.reservationService.getPendingReservations(),
      bikes: this.bikeService.getTopBikes()
    }).subscribe({
      next: ({ stats, reservations, bikes }) => {
        this.stats = stats;
        this.pendingReservations = reservations;
        this.topBikes = bikes;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
    this.notificationService.notifications$.subscribe(n => this.recentActivities = n);
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
