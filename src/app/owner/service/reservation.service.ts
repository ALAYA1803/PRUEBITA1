import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../model/reservation.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/owner/reservations';

  constructor() { }
  getPendingReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${environment.serverBaseUrl}/owner/reservations`);
  }

  accept(id: number): Observable<any> {
    return this.http.patch(`${environment.serverBaseUrl}/owner/reservations/${id}`, { status: 'Accepted' });
  }

  decline(id: number): Observable<any> {
    return this.http.patch(`${environment.serverBaseUrl}/owner/reservations/${id}`, { status: 'Declined' });
  }
}
