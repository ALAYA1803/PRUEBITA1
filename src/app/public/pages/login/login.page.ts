import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, TranslateModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, public translate: TranslateService) {}
  switchLanguage(language: string) {
    this.translate.use(language);
  }
  onForgotPassword() {

    this.router.navigate(['/forgot-password']);

  }

  onSubmit() {
    if (!this.email || !this.password) {
      alert(this.translate.instant('Login.ErrorEmptyFields'));
      return;
    }
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        const role = localStorage.getItem('userRole');
        if (role === 'owner') {
          this.router.navigate(['/owner/home']);
        } else if (role === 'renter') {
          this.router.navigate(['/renter/home']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        console.error(err);
        alert(this.translate.instant('Login.Error'));
      }
    });
  }
}
