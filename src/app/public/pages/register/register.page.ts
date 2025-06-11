import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private http: HttpClient, private router: Router, private translate: TranslateService) {}

  onSubmit() {
    const newUser = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      isOwner: this.isOwner
    };

    this.http
      .post('https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2', newUser)
      .subscribe({
        next: (response) => {
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
