import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { Profile } from '../../../model/profile.entity';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnChanges {
  @Input() profile!: Profile;
  @Input() editMode = false;
  @Output() profileUpdateRequested = new EventEmitter<Profile>();
  @Output() cancelRequested = new EventEmitter<void>();
  @ViewChild('profileForm', { static: false }) profileForm?: NgForm;

  editedProfile!: Profile;
  selectedPaymentMethod = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profile'] && this.profile) {
      this.editedProfile = {
        ...this.profile,
        preferences: { ...this.profile.preferences },
        paymentMethods: { ...this.profile.paymentMethods }
      };
      this.selectedPaymentMethod = this.editedProfile.paymentMethods.creditCard
        ? 'creditCard'
        : this.editedProfile.paymentMethods.paypal
          ? 'paypal'
          : '';
    }
  }

  updatePaymentMethod() {
    this.editedProfile.paymentMethods = {
      creditCard: this.selectedPaymentMethod === 'creditCard',
      paypal: this.selectedPaymentMethod === 'paypal'
    };
  }

  onSubmit() {
    if (this.profileForm?.valid) {
      this.profileUpdateRequested.emit(this.editedProfile);
      this.resetForm();
    }
  }

  onCancel() {
    this.cancelRequested.emit();
    this.resetForm();
  }

  private resetForm() {
    this.profileForm?.resetForm(this.profile);
    this.editMode = false;
  }
}
