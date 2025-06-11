import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router, private translate: TranslateService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      alert(this.translate.instant('Login.ErrorEmptyFields'));
      return;
    }
    const url = `https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2?email=${this.email}`;
    this.http.get<any[]>(url).subscribe({
      next: users => {
        if (users.length === 0) {
          alert(this.translate.instant('Login.UserNotFound'));
          return;
        }
        const user = users[0];
        if (user.password !== this.password) {
          alert(this.translate.instant('Login.WrongPassword'));
          return;
        }
        localStorage.setItem('userId',   user.id);
        localStorage.setItem('userRole', user.isOwner ? 'owner' : 'renter');
        this.router.navigate([ user.isOwner ? '/owner/home' : '/renter/home' ]);
      },
      error: err => {
        console.error(err);
        alert(this.translate.instant('Login.Error'));
      }
    });
  }
}
