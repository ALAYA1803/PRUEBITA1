import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SupportTicket {
  id: number;
  asunto: string;
  fecha: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class SupportService {
  private http = inject(HttpClient);

  getTickets(): Observable<SupportTicket[]> {
    return this.http.get<SupportTicket[]>(`${environment.serverBaseUrl}/owner/support`);
  }
}
