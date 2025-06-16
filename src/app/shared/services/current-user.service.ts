import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
export interface CurrentUser {
  id: string;
  fullName: string;
  avatar: string;
  phone: string;
  publicBio: string;
  password?: string;
  email?: string;
  address?: string;
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
