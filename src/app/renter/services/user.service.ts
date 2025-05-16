import { Injectable }  from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User }         from '../model/user.entity';
import { Observable }   from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.serverBaseUrl}${environment.usersEndpoint}`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }
}

