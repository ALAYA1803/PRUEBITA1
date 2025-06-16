import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CurrentUser, CurrentUserService } from '../../../shared/services/current-user.service';
import { ReviewsDialogComponent } from '../../../shared/components/reviews-dialog/reviews-dialog.component';
import { ChangePasswordDialogComponent } from '../../../shared/components/change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule, TranslateModule, MatDialogModule ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private currentUserService = inject(CurrentUserService);

  userData: CurrentUser | null = null;
  renterProfileData: any = {};
  personalInfoForm: FormGroup;
  preferencesForm: FormGroup;
  personalInfoEditMode = false;
  passwordVisible = false;
  currentPasswordMock = 'supersecretpassword';

  paymentMethods = ['Profile.Payment.Yape', 'Profile.Payment.Paypal', 'Profile.Payment.Debit', 'Profile.Payment.Credit'];
  bikeTypes = ['Profile.BikeType.Any', 'Profile.BikeType.Vintage', 'Profile.BikeType.BMX', 'Profile.BikeType.Sport', 'Profile.BikeType.Mountain'];
  reviewsMade: any[] = [];
  stars = Array(5).fill(0);

  constructor() {
    this.personalInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['', Validators.required],
      avatar: ['']
    });
    this.preferencesForm = this.fb.group({
      paymentMethod: [''],
      preferredBikeType: [''],
      notifications: [true]
    });
  }

  ngOnInit() { this.loadInitialData(); }

  private loadInitialData() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.currentUserService.loadUser(userId).subscribe(user => {
      this.userData = user;
      if (user.password) this.currentPasswordMock = user.password;
      this.personalInfoForm.patchValue({ name: user.fullName, email: user.email, phone: user.phone, address: user.address, avatar: user.avatar });
    });

    this.http.get<any[]>(`https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/renterProfiles?userId=${userId}`)
      .subscribe(profiles => {
        this.renterProfileData = profiles[0] || {};
        this.preferencesForm.patchValue({
          paymentMethod: this.renterProfileData.paymentMethod || 'Profile.Payment.Paypal',
          preferredBikeType: this.renterProfileData.preferredBikeType || 'Profile.BikeType.Any',
          notifications: this.renterProfileData.notifications !== undefined ? this.renterProfileData.notifications : true
        });
      });

    this.reviewsMade = [
      { ownerName: 'Ana', bikeModel: 'BMX Pro', rating: 5, comment: 'La bici de Ana es increíble, muy buen estado.', date: 'Hace 1 semana', ownerImage: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { ownerName: 'Luis', bikeModel: 'Vintage Verde', rating: 4, comment: 'Todo bien con el alquiler, proceso fácil.', date: 'Hace 3 semanas', ownerImage: 'https://randomuser.me/api/portraits/men/40.jpg' },
      { ownerName: 'Carla', bikeModel: 'Mountain X', rating: 4.5, comment: 'Perfecta para el cerro. Carla fue muy amable.', date: 'Hace 1 mes', ownerImage: 'https://randomuser.me/api/portraits/women/50.jpg' }
    ];

    this.personalInfoForm.disable();
    this.preferencesForm.disable();
  }

  onChangeProfilePicture(): void {
    if (!this.personalInfoEditMode) return;
    const promptMessage = this.translate.instant('Profile.ChangePicturePrompt');
    const newImageUrl = prompt(promptMessage, this.personalInfoForm.get('avatar')?.value || '');
    if (newImageUrl && newImageUrl.trim() !== '') {
      this.personalInfoForm.patchValue({ avatar: newImageUrl });
    }
  }

  toggleEditPersonalInfo() {
    if (this.personalInfoEditMode) { this.saveAllData(); }
    else {
      this.personalInfoForm.enable();
      this.preferencesForm.enable();
      this.personalInfoEditMode = true;
    }
  }

  cancelEditPersonalInfo() {
    this.loadInitialData();
  }

  private saveAllData() {
    if (!this.personalInfoForm.valid || !this.preferencesForm.valid || !this.userData) {
      this.snackBar.open(this.translate.instant('Profile.ErrorForm'), this.translate.instant('Profile.Close'), { duration: 3000 });
      return;
    }
    const personalValues = this.personalInfoForm.value;
    const preferenceValues = this.preferencesForm.value;
    const updatedUser: CurrentUser = { ...this.userData, fullName: personalValues.name, email: personalValues.email, phone: personalValues.phone, address: personalValues.address, avatar: personalValues.avatar };
    const finalUpdate = { ...updatedUser, ...preferenceValues };

    this.http.put(`https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2/${this.userData.id}`, finalUpdate)
      .subscribe(() => {
        this.currentUserService.updateCurrentUser({ fullName: finalUpdate.fullName, avatar: finalUpdate.avatar });
        this.snackBar.open(this.translate.instant('Profile.Saved'), this.translate.instant('Profile.OK'), { duration: 2000 });
        this.personalInfoForm.disable();
        this.preferencesForm.disable();
        this.personalInfoEditMode = false;
      });
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, { width: '400px', disableClose: true });
    dialogRef.afterClosed().subscribe((result: { newPassword?: string } | undefined) => {
      if (result && result.newPassword && this.userData) {
        this.http.put(`https://6824eacb0f0188d7e72b5f57.mockapi.io/api/v1/users2/${this.userData.id}`, { ...this.userData, password: result.newPassword })
          .subscribe(() => {
            this.currentPasswordMock = result.newPassword!;
            this.snackBar.open(this.translate.instant('Password.Success'), this.translate.instant('Profile.OK'), { duration: 3000 });
          });
      }
    });
  }

  openReviewsDialog() {
    const dialogData = {
      title: 'Profile.MyReviews',
      reviews: this.reviewsMade.map(review => ({
        reviewerName: review.ownerName,
        reviewerImage: review.ownerImage,
        reviewSubject: review.bikeModel,
        date: review.date,
        comment: review.comment,
        rating: review.rating
      }))
    };
    this.dialog.open(ReviewsDialogComponent, { width: '600px', data: dialogData });
  }

  getStarType(rating: number, index: number): string {
    if (rating >= index) {
      return 'star';
    } else if (rating >= index - 0.5) {
      return 'star_half';
    } else {
      return 'star_border';
    }
  }
}
