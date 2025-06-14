import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OwnerProfile } from '../../model/owner-profile.entity';
import { User } from '../../model/user.entity';

@Component({
  selector: 'app-owner-profile-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatSnackBarModule, MatChipsModule, TranslateModule ],
  templateUrl: './owner-profile.page.html',
  styleUrls: ['./owner-profile.page.css']
})
export class OwnerProfilePage implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  userData: User = new User();
  ownerProfileData: OwnerProfile = new OwnerProfile();
  personalInfoForm: FormGroup;
  payoutInfoForm: FormGroup;
  personalInfoEditMode = false;
  payoutInfoEditMode = false;
  reviewsReceived = [
    { renterName: 'Carlos Villa', rating: 5, comment: '¡La bicicleta estaba en perfecto estado! Ana fue muy amable.', date: 'Hace 2 días' },
    { renterName: 'Lucía Fernández', rating: 4, comment: 'Buen servicio, la ubicación era fácil de encontrar.', date: 'La semana pasada' }
  ];
  stars = Array(5).fill(0);

  constructor() {
    this.personalInfoForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      publicBio: ['', Validators.maxLength(200)]
    });

    this.payoutInfoForm = this.fb.group({
      payoutEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.userData = new User({ id: 1, name: 'Ana', email: 'ana.owner@example.com' });
    this.ownerProfileData = new OwnerProfile({
      userId: 1,
      publicBio: 'Amante de las bicicletas y de explorar la ciudad sobre dos ruedas. ¡Espero que disfrutes de mis bicis!',
      isVerified: true,
      payoutEmail: 'ana.payouts@paypal.com'
    });

    this.patchForms();
    this.personalInfoForm.disable();
    this.payoutInfoForm.disable();
  }

  private patchForms() {
    this.personalInfoForm.patchValue({
      name: this.userData.name,
      phone: '+51 999 888 777',
      publicBio: this.ownerProfileData.publicBio
    });
    this.payoutInfoForm.patchValue({
      payoutEmail: this.ownerProfileData.payoutEmail
    });
  }

  toggleEdit(form: FormGroup, mode: 'personal' | 'payout') {
    const editMode = mode === 'personal' ? this.personalInfoEditMode : this.payoutInfoEditMode;

    if (editMode) {
      if (form.valid) {
        console.log(`Guardando ${mode}:`, form.value);
        this.snackBar.open(this.translate.instant('Profile.Saved'), 'OK', { duration: 2000 });
        form.disable();
      } else {
        this.snackBar.open(this.translate.instant('Profile.ErrorForm'), 'Cerrar', { duration: 3000 });
        return;
      }
    } else {
      form.enable();
    }

    if (mode === 'personal') this.personalInfoEditMode = !this.personalInfoEditMode;
    else if (mode === 'payout') this.payoutInfoEditMode = !this.payoutInfoEditMode;
  }

  cancelEdit(form: FormGroup, mode: 'personal' | 'payout') {
    this.patchForms();
    form.disable();
    if (mode === 'personal') this.personalInfoEditMode = false;
    else if (mode === 'payout') this.payoutInfoEditMode = false;
  }

  getStarType(rating: number, index: number): string {
    return rating >= index ? 'star' : 'star_border';
  }
}
