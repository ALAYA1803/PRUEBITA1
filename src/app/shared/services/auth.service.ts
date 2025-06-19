import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token?: string; user?: any }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.user) {
          localStorage.setItem('userId', res.user.id);
          const role = res.user.role || (res.user.isOwner ? 'owner' : 'renter');
          if (role) {
            localStorage.setItem('userRole', role);
          }
        }
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, password });
  }
}
