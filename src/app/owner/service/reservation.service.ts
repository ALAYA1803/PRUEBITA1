import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../model/reservation.entity';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/owner/reservations';

  constructor() { }
  getPendingReservations(): Observable<Reservation[]> {
    throw new Error('Method not implemented.');
  }

  accept(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  decline(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
