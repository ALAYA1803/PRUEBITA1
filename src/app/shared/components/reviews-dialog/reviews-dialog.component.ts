import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

export interface ReviewsDialogData {
  reviews: any[];
  title: string;
  averageRating?: number;
}

@Component({
  selector: 'app-reviews-dialog',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, TranslateModule ],
  templateUrl: './reviews-dialog.component.html',
  styleUrls: ['./reviews-dialog.component.css']
})
export class ReviewsDialogComponent {
  stars = Array(5).fill(0);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ReviewsDialogData) {}

  getStarType(rating: number, index: number): string {
    return rating >= index ? 'star' : rating >= index - 0.5 ? 'star_half' : 'star_border';
  }
}
