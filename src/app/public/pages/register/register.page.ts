import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule, TranslateModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css']
})
export class RegisterPage {
  fullName: string = '';
  email: string = '';
  password: string = '';
  isOwner: boolean = false;

  constructor(private authService: AuthService, private router: Router, public translate: TranslateService) {}
  switchLanguage(language: string) {
    this.translate.use(language);
  }

  onSubmit() {
    const newUser = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      isOwner: this.isOwner
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        alert(this.translate.instant('Register.UserRegistered'));
        this.resetForm();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error registering user:', error);
        alert(this.translate.instant('Register.ErrorRegistering'));
      }
    });
  }

  private resetForm() {
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.isOwner = false;
  }
}
