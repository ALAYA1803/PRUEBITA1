import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SupportTicketDialogComponent } from '../../../shared/components/support-ticket-dialog/support-ticket-dialog.component';
import { SupportService, SupportTicket } from '../../service/support.service';


@Component({
  selector: 'app-owner-support-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './owner-support.page.html',
  styleUrls: ['./owner-support.page.css']
})
export class OwnerSupportPage implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private supportService = inject(SupportService);

  supportTickets: SupportTicket[] = [];
  loading = false;
  error = false;

  newRequestForm: FormGroup;
  categories: string[] = [
    'Support.CategoryPayments',
    'Support.CategoryIncident',
    'Support.CategoryAccount',
    'Support.CategorySuggestions',
    'Support.CategoryOther'
  ];
  selectedFileName: string | null = null;

  constructor() {
    this.newRequestForm = this.fb.group({
      asunto: ['', Validators.required],
      categoria: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(20)]],
      archivo: [null]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.error = false;
    this.supportService.getTickets().subscribe({
      next: tickets => {
        this.supportTickets = tickets;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.newRequestForm.valid) {
      console.log('Enviando nueva solicitud de soporte (Owner):', this.newRequestForm.value);
      this.snackBar.open(this.translate.instant('Support.Success'), 'OK', { duration: 3000 });
      this.newRequestForm.reset();
      this.selectedFileName = null;
      Object.keys(this.newRequestForm.controls).forEach(key => {
        this.newRequestForm.get(key)?.setErrors(null) ;
        this.newRequestForm.get(key)?.markAsPristine();
        this.newRequestForm.get(key)?.markAsUntouched();
      });
    } else {
      this.snackBar.open(this.translate.instant('Support.ErrorRequired'), this.translate.instant('Profile.Cancel'), { duration: 3000 });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.newRequestForm.patchValue({ archivo: file });
      this.selectedFileName = file.name;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  viewDetails(ticketId: number): void {
    const ticketData = this.supportTickets.find(ticket => ticket.id === ticketId);

    if (ticketData) {
      this.dialog.open(SupportTicketDialogComponent, {
        width: '550px',
        data: ticketData,
        panelClass: 'custom-dialog-container'
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
