import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-support-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.css']
})
export class SupportPage {
  contact = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Enviando mensaje:', this.contact);
      alert('¡Mensaje enviado! Te responderemos pronto.');
      form.resetForm();
    }
  }
}
