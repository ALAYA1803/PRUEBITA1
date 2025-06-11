// support.page.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// IMPORTANTE: Usaremos ReactiveFormsModule para el nuevo formulario
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Módulos de Angular Material necesarios para el nuevo diseño
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
    ReactiveFormsModule, // <-- AÑADIDO
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule, // <-- AÑADIDO
    MatSelectModule,    // <-- AÑADIDO
    MatIconModule,      // <-- AÑADIDO
    MatSnackBarModule,  // <-- AÑADIDO
    TranslateModule
  ],
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.css']
})
export class SupportPage implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  // --- Datos para la lista "Mis últimas solicitudes" (Ejemplo) ---
  // En un futuro, estos datos vendrían de un servicio
  supportTickets: any[] = [
    { id: 1, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'Resuelto' },
    { id: 2, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'En Proceso' },
    { id: 3, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'Resuelto' },
    { id: 4, asunto: 'Error al reservar una bicicleta', fecha: '05/06/2025', estado: 'Resuelto' }
  ];

  // --- Formulario para "Nueva solicitud de soporte" ---
  newRequestForm: FormGroup;
  categories: string[] = ['Problemas con Reservas', 'Consultas de Pago', 'Reportar un Problema Técnico', 'Sugerencias', 'Otro'];
  selectedFileName: string | null = null;

  constructor() {
    // Definimos la estructura y validadores del formulario
    this.newRequestForm = this.fb.group({
      asunto: ['', Validators.required],
      categoria: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
      archivo: [null]
    });
  }

  ngOnInit(): void {}

  // --- Lógica del Formulario ---
  onSubmit() {
    if (this.newRequestForm.valid) {
      console.log('Enviando nueva solicitud:', this.newRequestForm.value);

      // Aquí iría la lógica para enviar los datos al backend

      this.snackBar.open(this.translate.instant('Support.Success'), 'OK', { duration: 3000 });
      this.newRequestForm.reset();
      this.selectedFileName = null; // Limpiar el nombre del archivo
      // Esto es necesario para que los validadores se limpien visualmente
      Object.keys(this.newRequestForm.controls).forEach(key => {
        this.newRequestForm.get(key)?.setErrors(null) ;
        this.newRequestForm.get(key)?.markAsPristine();
        this.newRequestForm.get(key)?.markAsUntouched();
      });

    } else {
      this.snackBar.open(this.translate.instant('Support.ErrorRequired'), this.translate.instant('Profile.Cancel'), { duration: 3000 });
    }
  }

  // --- Lógica para el botón "Adjuntar Archivos" ---
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.newRequestForm.patchValue({ archivo: file });
      this.selectedFileName = file.name;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  // --- Lógica para los botones de la lista ---
  viewDetails(ticketId: number) {
    console.log('Viendo detalles del ticket ID:', ticketId);
    // Aquí podrías navegar a una página de detalle o mostrar un modal
    this.snackBar.open(`Cargando detalles para el ticket ${ticketId}...`, 'OK', { duration: 2000 });
  }

  // --- Helper para los estilos del estado ---
  getStatusClass(estado: string): string {
    if (estado === 'Resuelto') return 'status-resolved';
    if (estado === 'En Proceso') return 'status-in-progress';
    return '';
  }
}
