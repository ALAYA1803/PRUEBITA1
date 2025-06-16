import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TranslateModule],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.css']
})
export class ResetPasswordPage implements OnInit {
  password = '';
  confirmPassword = '';
  private userId: string | null = null;
  private apiUrl = 'https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (!this.userId) {
      alert('ID de usuario no encontrado.');
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (!this.password || !this.confirmPassword) {
      alert(this.translate.instant('ResetPassword.FieldsRequired'));
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert(this.translate.instant('ResetPassword.PasswordsDoNotMatch'));
      return;
    }

    const updatedData = { password: this.password };
    this.http.put(`${this.apiUrl}/${this.userId}`, updatedData).subscribe({
      next: () => {
        alert(this.translate.instant('ResetPassword.Success'));
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error updating password:', err);
        alert(this.translate.instant('ResetPassword.Error'));
      }
    });
  }
}
