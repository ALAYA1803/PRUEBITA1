import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
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
  username = '';
  stats: RenterStats | null = null;
  upcomingReservation: UpcomingReservation | null = null;
  recentRentals: RentalHistory[] = [];
  recommendations: Recommendation[] = [];
  private mockUpcomingReservations: UpcomingReservation[] = [
    { id: 'res-001', bikeName: 'Bicicleta de Montaña Specialized', date: '2025-06-18T17:00:00.000Z', address: 'Parque Kennedy, Miraflores', bikeImage: 'https://www.monark.com.pe/static/monark-pe/uploads/products/images/bicicleta-monark-highlander-xt-aro-29-rojo-negro-01.jpg', ownerName: 'Ana' }
  ];

  ngOnInit(): void {
    this.currentUserService.currentUser$.subscribe(user => {
      if (user) this.username = user.fullName.split(' ')[0];
    });
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    of({}).pipe(delay(200)).subscribe(() => {
      this.stats = { distanceTraveled: 54, rentalsCount: 8, drivingTime: 17, rating: 4.8 };
      this.upcomingReservation = this.mockUpcomingReservations.length > 0 ? this.mockUpcomingReservations[0] : null;

      this.recentRentals = [
        { bikeName: 'Vintage',  date: '15 junio', status: 'Finalizado', location: 'Plaza San Miguel' },
        { bikeName: 'Mountain', date: '11 junio', status: 'Finalizado', location: 'El Malecón' },
        { bikeName: 'BMX',      date: '05 junio', status: 'Cancelada',  location: 'Av. La Marina' },
      ];
      this.recommendations = [
        { id: 'bike-001', bikeName: 'Vintage verde', pricePerMinute: 0.5, distance: '400 m', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdDydP4N9WKFYaT6cZoxxGCw5kL2BVGseLww&s' },
        { id: 'bike-002', bikeName: 'Vintage rojo', pricePerMinute: 0.6, distance: '600 m', imageUrl: 'https://i.ebayimg.com/images/g/5O4AAOSw~-dlNVKg/s-l1600.jpg' },
        { id: 'bike-003', bikeName: 'City Cruiser', pricePerMinute: 0.4, distance: '200 m', imageUrl: 'https://bicicletamontana.com/wp-content/uploads/2020/09/bicicleta-de-paseo.jpg' }
      ];
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
        this.mockUpcomingReservations = this.mockUpcomingReservations.filter(r => r.id !== reservation.id);
        this.upcomingReservation = null;
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
        const newReservation: UpcomingReservation = {
          id: `res-${Date.now()}`,
          bikeName: rec.bikeName,
          date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          address: 'Ubicación de la bicicleta',
          bikeImage: rec.imageUrl,
          ownerName: 'Propietario de Bici'
        };
        this.mockUpcomingReservations.push(newReservation);
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
