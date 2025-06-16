import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Interfaz para definir la estructura de los datos que recibirá el diálogo
export interface TicketDialogData {
  id: number;
  asunto: string;
  fecha: string;
  estado: string;
  // Podríamos añadir más datos aquí en el futuro, como el mensaje completo.
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

  // Inyectamos los datos pasados desde la página principal
  constructor(@Inject(MAT_DIALOG_DATA) public data: TicketDialogData) {}

  // Copiamos estas funciones aquí para que el diálogo pueda mostrar el estado correctamente
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
