import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Reservation } from '../../model/reservation.entity';
import { ReservationService } from '../../service/reservation.service';

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, MatButtonModule, TranslateModule, CurrencyPipe, DatePipe],
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.css']
})
export class ReservationsPage implements OnInit {
  allReservations: Reservation[] = [];
  loading = false;
  error = false;

  private reservationService = inject(ReservationService);
  private translate = inject(TranslateService);
  get pendingReservations(): Reservation[] {
    return this.allReservations.filter(r => r.status === 'Pending');
  }
  get upcomingReservations(): Reservation[] {
    return this.allReservations.filter(r => r.status === 'Accepted');
  }
  get completedReservations(): Reservation[] {
    return this.allReservations.filter(r => r.status === 'Completed');
  }
  get historyReservations(): Reservation[] {
    return this.allReservations.filter(r => r.status === 'Cancelled' || r.status === 'Declined');
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = false;
    this.reservationService.getPendingReservations().subscribe({
      next: res => {
        this.allReservations = res;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  accept(id: number) { console.log(`Aceptando reserva ${id}`); }
  decline(id: number) { console.log(`Rechazando reserva ${id}`); }
  contactRenter(reservation: Reservation) {
    const promptMessage = this.translate.instant('Reservations.ContactPromptMessage', { renterName: reservation.renterName });

    const message = prompt(promptMessage);

    if (message) {
      console.log(`(Simulación) Mensaje enviado a ${reservation.renterName}: "${message}"`);
      alert(this.translate.instant('Reservations.ContactSuccess'));
    } else {
      console.log('Envío de mensaje cancelado.');
    }
  }
  getStatusInfo(status: Reservation['status']): { class: string; icon: string; textKey: string } {
    switch (status) {
      case 'Pending': return { class: 'status-pending', icon: 'hourglass_top', textKey: 'Reservations.StatusPending' };
      case 'Accepted': return { class: 'status-accepted', icon: 'event_available', textKey: 'Reservations.StatusAccepted' };
      case 'Completed': return { class: 'status-completed', icon: 'check_circle', textKey: 'Reservations.StatusCompleted' };
      case 'Cancelled': return { class: 'status-cancelled', icon: 'cancel', textKey: 'Reservations.StatusCancelled' };
      case 'Declined': return { class: 'status-declined', icon: 'block', textKey: 'Reservations.StatusDeclined' };
    }
  }
}
