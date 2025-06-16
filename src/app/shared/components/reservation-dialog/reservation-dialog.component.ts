import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface ReservationDialogData {
  bikeName: string;
  pricePerMinute: number;
  imageUrl: string;
}

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule, MatSliderModule, CurrencyPipe, TranslateModule ],
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css']
})
export class ReservationDialogComponent {
  durationInMinutes = 30;

  constructor(
    public dialogRef: MatDialogRef<ReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReservationDialogData
  ) {}

  get totalCost(): number {
    return this.durationInMinutes * this.data.pricePerMinute;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
