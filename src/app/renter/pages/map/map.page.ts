import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafePipe } from '../../../shared/pipes/safe.pipe';

interface Station {
  name: string;
  bikes: number;
  distance: string;
  docks: number;
}

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.css']
})
export class MapPage {
  location = 'Lima';
  hasSearched = false;

  stations: Station[] = [
    { name: 'Av. Arequipa', bikes: 3, distance: '200 m', docks: 13 },
    { name: 'Plaza San Miguel', bikes: 5, distance: '460 m', docks: 10 },
    { name: 'Parque Kennedy', bikes: 1, distance: '600 m', docks: 7 },
    { name: 'Mercedes Gallagher de Parks', bikes: 5, distance: '120 m', docks: 9 },
    { name: 'UPC', bikes: 2, distance: '10 m', docks: 10 }
  ];

  filteredStations: Station[] = [...this.stations];
  selectedStation: Station | null = null;

  get totalBikes(): number {
    return this.stations.reduce((sum, s) => sum + s.bikes, 0);
  }

  get totalDocks(): number {
    return this.stations.reduce((sum, s) => sum + s.docks, 0);
  }

  get mapUrl(): string {
    return `https://www.google.com/maps?q=${encodeURIComponent(this.location)},+Peru&output=embed`;
  }

  searchLocation(input: HTMLInputElement) {
    const q = input.value.trim();
    this.location = q || 'Lima';
    this.hasSearched = true;
    this.filteredStations = this.stations.filter(s =>
      s.name.toLowerCase().includes(this.location.toLowerCase())
    );
    this.selectedStation = this.filteredStations[0] || null;
  }
}
