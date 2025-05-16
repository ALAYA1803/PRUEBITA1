import { Component, inject, OnInit } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { MatCardModule }             from '@angular/material/card';
import { MatIconModule }             from '@angular/material/icon';
import { MatButtonModule }           from '@angular/material/button';
import { TranslatePipe }             from '@ngx-translate/core';
import {  NgIf, NgForOf, NgClass } from '@angular/common';
import { Profile }        from '../../model/profile.entity';
import { User }           from '../../model/user.entity';
import { ProfileService } from '../../services/profile.service';
import { UserService }    from '../../services/user.service';
import { ProfileEditComponent } from '../profile/profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    NgClass,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    ProfileEditComponent
  ],
  templateUrl: './profile.page.html',
 styleUrls:   ['./profile.page.css']
})
export class ProfilePage implements OnInit {
  profileData: Profile = new Profile({});
  userData:    User    = new User({});
  editMode = false;
  stars = [1,2,3,4,5];

  private profileService = inject(ProfileService);
  private userService    = inject(UserService);

  ngOnInit() {
    this.loadUser();
    this.loadProfile();
  }

  private loadUser() {
    this.userService.getById(1)
      .subscribe(u => this.userData = u);
  }

  private loadProfile() {
    this.profileService.getByUserId(1)
      .subscribe(p => this.profileData = p);
  }

  getStarType(i: number) {
    const r = this.profileData.rating;
    return r >= i
      ? 'star'
      : r >= i - 0.5
        ? 'star_half'
        : 'star_border';
  }

  onEditRequested() {
    this.editMode = true;
  }

  onCancelRequested() {
    this.editMode = false;
    this.loadProfile();
  }

  onProfileUpdatedRequested(updated: Profile) {
    this.profileService.update(updated.id, updated)
      .subscribe(saved => {
        this.profileData = saved;
        this.editMode = false;
      });
  }
}
