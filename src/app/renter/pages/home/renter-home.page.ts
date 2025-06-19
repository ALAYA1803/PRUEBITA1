import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardService, RenterDashboardData } from '../../services/dashboard.service';
import { MatIconModule } from '@angular/material/icon';

import { CurrentUserService } from '../../../shared/services/current-user.service';
import { ReservationDialogComponent, ReservationDialogData } from '../../../shared/components/reservation-dialog/reservation-dialog.component';
import { ReservationDetailsDialogComponent } from '../../../shared/components/reservation-details-dialog/reservation-details-dialog.component';
import { CancelConfirmationDialogComponent } from '../../../shared/components/cancel-confirmation-dialog/cancel-confirmation-dialog.component';
interface RenterStats {
  distanceTraveled: number;
  rentalsCount: number;
  drivingTime: number;
  rating: number;
}
interface UpcomingReservation {
  id: string;
  bikeName: string;
  date: string;
  address: string;
  bikeImage: string;
  ownerName: string;
}
interface RentalHistory {
  bikeName: string;
  date: string;
  status: 'Finalizado' | 'Cancelada' | 'Activa';
  location: string;
}
interface Recommendation {
  id: string;
  bikeName: string;
  pricePerMinute: number;
  distance: string;
  imageUrl: string;
}

@Component({
  selector: 'app-renter-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatSnackBarModule,
    CurrencyPipe,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './renter-home.page.html',
  styleUrls: ['./renter-home.page.css']
})
export class RenterHomePage implements OnInit {
  private translate = inject(TranslateService);
  private currentUserService = inject(CurrentUserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private dashboardService = inject(DashboardService);
  username = '';
  stats: RenterStats | null = null;
  upcomingReservation: UpcomingReservation | null = null;
  recentRentals: RentalHistory[] = [];
  recommendations: Recommendation[] = [];
  loading = false;
  error = false;

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe(user => {
      if (user) this.username = user.fullName.split(' ')[0];
    });
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = false;
    this.dashboardService.getDashboardData().subscribe({
      next: (data: RenterDashboardData) => {
        this.stats = data.stats;
        this.upcomingReservation = data.upcomingReservation;
        this.recentRentals = data.recentRentals;
        this.recommendations = data.recommendations;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  viewDetails(reservation: UpcomingReservation): void {
    this.dialog.open(ReservationDetailsDialogComponent, {
      width: '500px',
      data: reservation
    });
  }

  cancelReservation(reservation: UpcomingReservation): void {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, { width: '450px' });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loadDashboardData();
        this.snackBar.open('Reserva cancelada exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  reserveBike(rec: Recommendation): void {
    const dialogData: ReservationDialogData = {
      bikeName: rec.bikeName,
      pricePerMinute: rec.pricePerMinute,
      imageUrl: rec.imageUrl
    };
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loadDashboardData();
        this.snackBar.open(`¡Has reservado la ${rec.bikeName} exitosamente!`, 'OK', { duration: 3000 });
      }
    });
  }

  translateStatus(status: string): string {
    if (status === 'Finalizado') return this.translate.instant('RenterHome.StatusFinalizado');
    if (status === 'Cancelada') return this.translate.instant('RenterHome.StatusCancelada');
    if (status === 'Activa') return this.translate.instant('RenterHome.StatusActiva');
    return status;
  }
}
