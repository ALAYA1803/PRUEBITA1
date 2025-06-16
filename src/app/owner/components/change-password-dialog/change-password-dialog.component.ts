import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

// Validador personalizado para asegurar que las contraseñas coincidan
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, TranslateModule ],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);

  passwordForm: FormGroup;
  newPasswordVisible = false;
  confirmPasswordVisible = false;

  constructor() {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSave(): void {
    if (this.passwordForm.valid) {
      console.log('Nueva contraseña (simulación):', this.passwordForm.value.newPassword);
      // --- MEJORADO: Devuelve el valor de la nueva contraseña al cerrar ---
      this.dialogRef.close({ newPassword: this.passwordForm.value.newPassword });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
