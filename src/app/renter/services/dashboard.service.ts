import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RenterDashboardData {
  stats: any;
  upcomingReservation: any;
  recentRentals: any[];
  recommendations: any[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboardData(): Observable<RenterDashboardData> {
    return this.http.get<RenterDashboardData>(`${environment.serverBaseUrl}/renter/dashboard`);
  }
}
