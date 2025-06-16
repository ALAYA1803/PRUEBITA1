import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SupportTicketDialogComponent } from '../../../shared/components/support-ticket-dialog/support-ticket-dialog.component';

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule,
    MatFormFieldModule, MatSelectModule, MatIconModule, MatSnackBarModule,
    TranslateModule, MatDialogModule
  ],
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.css']
})
export class SupportPage implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);

  supportTickets: any[] = [
    { id: 1, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'Resuelto' },
    { id: 2, asunto: 'Problema con el pago de Yape', fecha: '08/06/2025', estado: 'En Proceso' },
    { id: 3, asunto: 'La bicicleta tenía una llanta baja', fecha: '12/06/2025', estado: 'Resuelto' },
  ];
  newRequestForm: FormGroup;
  categories: string[] = [
    'Support.Category.Booking',
    'Support.Category.Payment',
    'Support.Category.Technical',
    'Support.Category.Suggestions',
    'Support.Category.Other'
  ];
  selectedFileName: string | null = null;

  constructor() {
    this.newRequestForm = this.fb.group({
      asunto: ['', Validators.required],
      categoria: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
      archivo: [null]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.newRequestForm.valid) {
      console.log('Enviando nueva solicitud (Renter):', this.newRequestForm.value);
      this.snackBar.open(this.translate.instant('Support.Success'), this.translate.instant('Profile.OK'), { duration: 3000 });
      this.newRequestForm.reset();
      this.selectedFileName = null;
      Object.keys(this.newRequestForm.controls).forEach(key => {
        this.newRequestForm.get(key)?.setErrors(null);
        this.newRequestForm.get(key)?.markAsPristine();
        this.newRequestForm.get(key)?.markAsUntouched();
      });
    } else {
      this.snackBar.open(this.translate.instant('Support.ErrorRequired'), this.translate.instant('Profile.Close'), { duration: 3000 });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.newRequestForm.patchValue({ archivo: file });
      this.selectedFileName = file.name;
    }
  }
  viewDetails(ticketId: number): void {
    const ticketData = this.supportTickets.find(ticket => ticket.id === ticketId);
    if (ticketData) {
      this.dialog.open(SupportTicketDialogComponent, {
        width: '550px',
        data: ticketData
      });
    } else {
      console.error('No se encontró el ticket con ID:', ticketId);
    }
  }

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
