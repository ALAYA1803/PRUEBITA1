import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CurrentUser, CurrentUserService } from '../../../shared/services/current-user.service';
import { AllReviewsDialogComponent } from '../../components/all-reviews-dialog/all-reviews-dialog.component';
import { ChangePasswordDialogComponent } from '../../../shared/components/change-password-dialog/change-password-dialog.component';
import { ReviewsDialogComponent } from '../../../shared/components/reviews-dialog/reviews-dialog.component';

@Component({
  selector: 'app-owner-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatChipsModule, MatTabsModule,
    MatDialogModule, TranslateModule],
  templateUrl: './owner-profile.page.html',
  styleUrls: ['./owner-profile.page.css']
})
export class OwnerProfilePage implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private currentUserService = inject(CurrentUserService);

  userData: CurrentUser | null = null;
  ownerProfileData: any = {};
  personalInfoForm: FormGroup;
  payoutInfoForm: FormGroup;
  personalInfoEditMode = false;
  payoutInfoEditMode = false;
  currentPasswordVisible = false;
  currentPasswordMock = 'supersecretpassword';

  reviewsReceived: any[] = [];
  averageRating = 0;
  stars = Array(5).fill(0);

  constructor() {
    this.personalInfoForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      publicBio: ['', Validators.maxLength(200)],
      avatar: ['']
    });
    this.payoutInfoForm = this.fb.group({
      paypalEmail: ['', Validators.email],
      bankAccountNumber: ['', Validators.pattern('^[0-9-]*$')],
      yapePhoneNumber: ['', Validators.pattern('^9[0-9]{8}$')]
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.currentUserService.loadUser(userId).subscribe(user => {
      this.userData = user;
      if (user.password) this.currentPasswordMock = user.password;
      this.personalInfoForm.patchValue({ name: user.fullName, phone: user.phone, publicBio: user.publicBio, avatar: user.avatar });
    });
    this.http.get<any[]>(`https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/ownerProfiles?userId=${userId}`)
      .subscribe(profiles => {
        this.ownerProfileData = profiles[0] || {};
        this.payoutInfoForm.patchValue({ paypalEmail: this.ownerProfileData.paypalEmail, bankAccountNumber: this.ownerProfileData.bankAccountNumber, yapePhoneNumber: this.ownerProfileData.yapePhoneNumber });
      });

    // SOLUCIÓN: Añadimos más reseñas para que el botón "Ver más" aparezca
    this.reviewsReceived = [
      { renterName: 'Carlos Villa', rating: 5, comment: '¡La bicicleta estaba en perfecto estado! Ana fue muy amable.', date: 'Hace 2 días', renterImage: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { renterName: 'Lucía Fernández', rating: 4, comment: 'Buen servicio, la ubicación era fácil de encontrar.', date: 'La semana pasada', renterImage: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { renterName: 'Marco Polo', rating: 4.5, comment: 'Todo bien, pero la llanta estaba un poco baja de aire.', date: 'Hace 2 semanas', renterImage: 'https://randomuser.me/api/portraits/men/56.jpg' }
    ];
    if (this.reviewsReceived.length > 0) {
      this.averageRating = this.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / this.reviewsReceived.length;
    }

    this.personalInfoForm.disable();
    this.payoutInfoForm.disable();
  }
  onChangeProfilePicture(): void {
    if (!this.personalInfoEditMode) return;
    const promptMessage = this.translate.instant('Profile.ChangePicturePrompt');
    const currentAvatarUrl = this.personalInfoForm.get('avatar')?.value || '';
    const newImageUrl = prompt(promptMessage, currentAvatarUrl);

    if (newImageUrl && newImageUrl.trim() !== '') {
      this.personalInfoForm.patchValue({ avatar: newImageUrl });
    }
  }

  toggleEdit(form: FormGroup, mode: 'personal' | 'payout') {
    const editing = mode === 'personal' ? this.personalInfoEditMode : this.payoutInfoEditMode;
    if (editing) {
      if (!form.valid) {
        this.snackBar.open(this.translate.instant('Profile.ErrorForm'), this.translate.instant('Profile.Close'), { duration: 3000 });
        return;
      }
      if (mode === 'personal') {
        if (!this.userData) return;
        const updatedUser = { ...this.userData, ...form.value, fullName: form.value.name };
        this.http.put(`https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2/${this.userData.id}`, updatedUser)
          .subscribe(() => {
            this.currentUserService.updateCurrentUser({ fullName: updatedUser.fullName, avatar: updatedUser.avatar });
            this.snackBar.open(this.translate.instant('Profile.Saved'), this.translate.instant('Profile.OK'), { duration: 2000 });
            form.disable();
            this.personalInfoEditMode = false;
          });
      } else { /* ... */ }
    } else {
      form.enable();
      if (mode === 'personal') this.personalInfoEditMode = true; else this.payoutInfoEditMode = true;
    }
  }

  cancelEdit(form: FormGroup, mode: 'personal' | 'payout') {
    this.loadInitialData();
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, { width: '400px', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.newPassword && this.userData) {
        const updatedUser = { ...this.userData, password: result.newPassword };
        this.http.put(`https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2/${this.userData.id}`, updatedUser)
          .subscribe(() => {
            this.currentPasswordMock = result.newPassword;
            this.snackBar.open(this.translate.instant('Password.Success'), this.translate.instant('Profile.OK'), { duration: 3000 });
          });
      }
    });
  }

  openReviewsDialog() {
    const dialogData = {
      title: 'OwnerProfile.AllReviews',
      averageRating: this.averageRating,
      reviews: this.reviewsReceived.map(review => ({
        reviewerName: review.renterName,
        reviewerImage: review.renterImage,
        reviewSubject: review.date,
        date: review.date,
        comment: review.comment,
        rating: review.rating
      }))
    };
    this.dialog.open(ReviewsDialogComponent, { width: '600px', data: dialogData });
  }

  getStarType(r: number, i: number) { return r >= i ? 'star' : r >= i - 0.5 ? 'star_half' : 'star_border'; }
}
