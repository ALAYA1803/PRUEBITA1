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
    this.loadMockReservations();
  }

  loadMockReservations(): void {
    const now = new Date();
    this.allReservations = [
      new Reservation({ id: 1, renterName: 'Carlos Villa', bikeName: 'BMX Pro', date: new Date(now.getTime() + 2 * 24 * 3600 * 1000), status: 'Pending', totalPrice: 25.00, renterImage: 'https://randomuser.me/api/portraits/men/32.jpg' }),
      new Reservation({ id: 2, renterName: 'Lucía Fernández', bikeName: 'Vintage Verde', date: new Date(now.getTime() + 5 * 24 * 3600 * 1000), status: 'Accepted', totalPrice: 40.00, renterImage: 'https://randomuser.me/api/portraits/women/44.jpg' }),
      new Reservation({ id: 3, renterName: 'Javier Soto', bikeName: 'Mountain X', date: new Date(now.getTime() - 7 * 24 * 3600 * 1000), endDate: new Date(now.getTime() - 6 * 24 * 3600 * 1000), status: 'Completed', totalPrice: 75.00, renterImage: 'https://randomuser.me/api/portraits/men/56.jpg' }),
      new Reservation({ id: 4, renterName: 'Ana Gómez', bikeName: 'BMX Pro', date: new Date(now.getTime() - 10 * 24 * 3600 * 1000), status: 'Cancelled', totalPrice: 15.00, renterImage: 'https://randomuser.me/api/portraits/women/68.jpg' }),
      new Reservation({ id: 5, renterName: 'Pedro Pascal', bikeName: 'Vintage Verde', date: new Date(now.getTime() - 15 * 24 * 3600 * 1000), status: 'Declined', totalPrice: 30.00, renterImage: 'https://randomuser.me/api/portraits/men/72.jpg' }),
    ];
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
