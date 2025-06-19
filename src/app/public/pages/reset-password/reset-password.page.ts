import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
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

    const id = this.userId ?? '';
    this.authService.resetPassword(id, this.password).subscribe({
      next: () => {
        alert(this.translate.instant('ResetPassword.Success'));
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Error updating password:', err);
        alert(this.translate.instant('ResetPassword.Error'));
      }
    });
  }
}
