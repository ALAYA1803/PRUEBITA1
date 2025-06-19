import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  onSubmit() {
    if (!this.email) {
      alert(this.translate.instant('ForgotPassword.EmailRequired'));
      return;
    }

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        const id = res?.userId;
        if (id) {
          this.router.navigate(['/reset-password', id]);
        } else {
          this.router.navigate(['/reset-password']);
        }
      },
      error: (err) => {
        console.error('Error verifying email:', err);
        alert(this.translate.instant('ForgotPassword.Error'));
      }
    });
  }
}
