import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bike } from '../model/bike.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/owner/bikes';

  constructor() { }

  getTopBikes(): Observable<Bike[]> {
    return this.http.get<Bike[]>(`${environment.serverBaseUrl}/owner/bikes/top`);
  }

  getOwnerBikes(): Observable<Bike[]> {
    return this.http.get<Bike[]>(`${environment.serverBaseUrl}/owner/bikes`);
  }
}
