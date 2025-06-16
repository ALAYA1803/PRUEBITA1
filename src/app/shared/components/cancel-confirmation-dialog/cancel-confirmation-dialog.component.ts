import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cancel-confirmation-dialog',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon color="warn">warning_amber</mat-icon>
      <span>{{ 'RenterHome.CancelConfirmationTitle' | translate }}</span>
    </h2>
    <mat-dialog-content>
      <p>{{ 'RenterHome.CancelConfirmationMessage' | translate }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">{{ 'RenterHome.KeepReservation' | translate }}</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">{{ 'RenterHome.ConfirmCancel' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      --text-primary: #1E293B;
      --text-secondary: #64748B;
      font-family: 'Inter', sans-serif;
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .dialog-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    mat-dialog-content p {
      color: var(--text-secondary);
      line-height: 1.6;
      font-size: 1rem;
      padding: 0.5rem 0;
    }
    mat-dialog-actions {
      padding: 0 24px 20px 24px;
    }
  `]
})
export class CancelConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<CancelConfirmationDialogComponent>) {}
  onNoClick(): void { this.dialogRef.close(); }
}
