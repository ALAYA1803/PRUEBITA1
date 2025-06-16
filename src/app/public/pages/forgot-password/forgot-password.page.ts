import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, TranslateModule],
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.css']
})
export class ForgotPasswordPage {
  email: string = '';
  private apiUrl = 'https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2';

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {}

  onSubmit() {
    if (!this.email) {
      alert(this.translate.instant('ForgotPassword.EmailRequired'));
      return;
    }

    this.http.get<any[]>(`${this.apiUrl}?email=${this.email}`).subscribe({
      next: (users) => {
        if (users && users.length > 0) {
          const userId = users[0].id;
          this.router.navigate(['/reset-password', userId]);
        } else {
          alert(this.translate.instant('ForgotPassword.UserNotFound'));
        }
      },
      error: (err) => {
        console.error('Error verifying email:', err);
        alert(this.translate.instant('ForgotPassword.Error'));
      }
    });
  }
}
