import { Component }    from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink }   from '@angular/router';

interface Rental {
  bike: string;
  departureDate: string;
  departureStation: string;
  returnDate: string;
  returnStation: string;
  duration: string;
}

@Component({
  selector: 'app-renter-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './renter-home.page.html',
  styleUrls: ['./renter-home.page.css']
})
export class RenterHomePage {
  distanceTraveled = 0;
  rentals: Rental[] = [];
}
