import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Profile } from '../../model/profile.entity';
import { User } from '../../model/user.entity';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit {
  private profileService = inject(ProfileService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  profileData: Profile = new Profile({});
  userData: User = new User({});
  personalInfoForm: FormGroup;
  personalInfoEditMode = false;
  passwordVisible = false;
  currentPassword = 'supersecretpassword123';
  paymentMethods = ['Yape','Paypal', 'Tarjeta de débito', 'Tarjeta de crédito'];
  bikeTypes = ['Cualquiera','Vintage', 'BMX', 'Sport', 'Mountain'];
  stars = Array(5).fill(0);

  constructor() {
    this.personalInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['', Validators.required],
      profileImage: ['']
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const userId = 1;
    this.userData = new User({
      id: 1,
      name: 'Rodrigo Pérez García',
      email: 'rodrigo.perez@gmail.com'
    });
    this.profileData = new Profile({
      userId: 1,
      phone: '+51 987 654 321',
      address: '124 josefina ramos de cox, Lima',
      profileImage: 'https://via.placeholder.com/150',
      preferredBikeType: 'Vintage',
      paymentMethod: 'Paypal',
      notifications: true
    });
    this.patchFormWithData();
    this.personalInfoForm.disable();
  }

  private patchFormWithData() {
    this.personalInfoForm.patchValue({
      name: this.userData.name,
      email: this.userData.email,
      phone: this.profileData.phone,
      address: this.profileData.address,
      profileImage: this.profileData.profileImage
    });
  }

  toggleEditPersonalInfo() {
    if (this.personalInfoEditMode) {
      this.savePersonalInfo();
    } else {
      this.personalInfoForm.enable();
      this.personalInfoEditMode = true;
    }
  }

  cancelEditPersonalInfo() {
    this.patchFormWithData();
    this.personalInfoForm.disable();
    this.personalInfoEditMode = false;
  }

  private savePersonalInfo() {
    if (this.personalInfoForm.invalid) {
      this.snackBar.open('Por favor, corrige los errores en el formulario.', 'Cerrar', { duration: 3000 });
      return;
    }
    const formValues = this.personalInfoForm.value;
    this.userData.name = formValues.name;
    this.userData.email = formValues.email;
    this.profileData.phone = formValues.phone;
    this.profileData.address = formValues.address;
    this.profileData.profileImage = formValues.profileImage;

    console.log('Guardando Usuario:', this.userData);
    console.log('Guardando Perfil:', this.profileData);
    this.snackBar.open('Información guardada con éxito.', 'OK', { duration: 2000 });

    this.personalInfoForm.disable();
    this.personalInfoEditMode = false;
  }
  onProfilePictureClick() {
    if (this.personalInfoEditMode) {
      const newImageUrl = prompt("Introduce la URL de tu nueva foto de perfil:", this.personalInfoForm.value.profileImage);
      if (newImageUrl && newImageUrl.trim() !== '') {
        this.personalInfoForm.patchValue({ profileImage: newImageUrl });
      }
    }
  }
  onPreferenceChanged(field: keyof Profile, value: any) {
    (this.profileData as any)[field] = value;
    console.log(`Preferencia '${field}' actualizada a '${value}' y guardada.`);
    this.snackBar.open(`Preferencia '${field}' actualizada.`, 'OK', { duration: 2000 });
  }

  getStarType(rating: number, index: number) {
    if (rating >= index) return 'star';
    if (rating >= index - 0.5) return 'star_half';
    return 'star_border';
  }
}
