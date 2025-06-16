import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

// --- MEJORA: Interfaz más específica para evitar errores de tipo ---
export interface CurrentUser {
  id: string;
  fullName: string;
  avatar: string;
  phone: string;
  publicBio: string;
  password?: string; // La contraseña es opcional, puede que no siempre la necesitemos
  // Ya no necesitamos la firma de índice [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2';

  private userSource = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.userSource.asObservable();

  constructor() { }

  loadUser(userId: string): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/${userId}`).pipe(
      tap(user => this.userSource.next(user))
    );
  }

  updateCurrentUser(updatedData: Partial<CurrentUser>): void {
    const currentUser = this.userSource.getValue();
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedData };
      this.userSource.next(newUser);
    }
  }

  getCurrentUserSnapshot(): CurrentUser | null {
    return this.userSource.getValue();
  }
}
