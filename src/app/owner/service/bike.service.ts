import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bike } from '../model/bike.entity';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/owner/bikes';

  constructor() { }

  getTopBikes(): Observable<Bike[]> {
    throw new Error('Method not implemented.');
  }
}
