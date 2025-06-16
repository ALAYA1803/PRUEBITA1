import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
export interface TicketDialogData {
  id: number;
  asunto: string;
  fecha: string;
  estado: string;
}

@Component({
  selector: 'app-support-ticket-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './support-ticket-dialog.component.html',
  styleUrls: ['./support-ticket-dialog.component.css']
})
export class SupportTicketDialogComponent {
  private translate = inject(TranslateService);
  constructor(@Inject(MAT_DIALOG_DATA) public data: TicketDialogData) {}
  translateStatus(estado: string): string {
    if (estado === 'Resuelto') return this.translate.instant('Support.StatusResolved');
    if (estado === 'En Proceso') return this.translate.instant('Support.StatusInProgress');
    return estado;
  }

  getStatusClass(estado: string): string {
    if (estado === 'Resuelto') return 'status-resolved';
    if (estado === 'En Proceso') return 'status-in-progress';
    return '';
  }
}
