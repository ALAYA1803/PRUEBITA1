import { Injectable }    from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { environment }   from '../../../environments/environment';
import { Profile }       from '../model/profile.entity';
import { Observable }    from 'rxjs';
import { map }           from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private base = `${environment.serverBaseUrl}${environment.profilesEndpoint}`;

  constructor(private http: HttpClient) {}

  getByUserId(userId: number): Observable<Profile> {
    return this.http
      .get<Profile[]>(`${this.base}?userId=${userId}`)
      .pipe(map(list => new Profile(list[0])));
  }

  update(id: number, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.base}/${id}`, profile);
  }
}
