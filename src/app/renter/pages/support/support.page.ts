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

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.css']
})
export class SupportPage implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  supportTickets: any[] = [
    { id: 1, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'Resuelto' },
    { id: 2, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'En Proceso' },
    { id: 3, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'Resuelto' },
    { id: 4, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'Resuelto' }
  ];
  newRequestForm: FormGroup;
  categories: string[] = ['Problemas con Reservas', 'Consultas de Pago', 'Reportar un Problema Técnico', 'Sugerencias', 'Otro'];
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
      console.log('Enviando nueva solicitud:', this.newRequestForm.value);

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
  viewDetails(ticketId: number) {
    console.log('Viendo detalles del ticket ID:', ticketId);
    this.snackBar.open(`Cargando detalles para el ticket ${ticketId}...`, 'OK', { duration: 2000 });
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
