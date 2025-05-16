import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css']
})
export class RegisterPage {
  fullName: string = '';
  email: string = '';
  password: string = '';
  isOwner: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

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
          alert('User registered successfully!');
          this.resetForm();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error registering user:', error);
          alert('Error registering user');
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
