import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { SafePipe } from '../../../shared/pipes/safe.pipe';

interface Station {
  name: string;
  bikes: number;
  distance: string;
  docks: number;
  lat: number;
  lng: number;
}

const STATIONS: Station[] = [
  { name: 'Av. Arequipa', bikes: 3, distance: '200 m', docks: 13, lat: -12.105, lng: -77.035 },
  { name: 'Plaza San Miguel', bikes: 5, distance: '460 m', docks: 10, lat: -12.079, lng: -77.087 },
  { name: 'Parque Kennedy', bikes: 1, distance: '600 m', docks: 7, lat: -12.121, lng: -77.03 },
  { name: 'Mercedes Gallagher de Parks', bikes: 5, distance: '120 m', docks: 9, lat: -12.096, lng: -77.044 },
  { name: 'UPC', bikes: 2, distance: '10 m', docks: 10, lat: -12.105, lng: -76.963 }
];

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SafePipe],
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.css']
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  map?: L.Map;
  markers: Record<string, L.Marker> = {};

  location = 'Lima';
  hasSearched = false;

  stations: Station[] = STATIONS;
  filteredStations: Station[] = [...STATIONS];
  selectedStation: Station | null = null;

  get totalBikes(): number {
    return this.stations.reduce((sum, s) => sum + s.bikes, 0);
  }

  get totalDocks(): number {
    return this.stations.reduce((sum, s) => sum + s.docks, 0);
  }

  ngAfterViewInit(): void {
    if (!this.mapContainer) return;

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [STATIONS[0].lat, STATIONS[0].lng],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const greenIcon = L.icon({
      iconUrl:
        'https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.1.1/img/marker-icon-green.png',
      shadowUrl:
        'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const yellowIcon = L.icon({
      iconUrl:
        'https://cdn.jsdelivr.net/npm/leaflet-color-markers@1.1.1/img/marker-icon-yellow.png',
      shadowUrl:
        'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    STATIONS.forEach((station) => {
      const icon = station.bikes > 2 ? greenIcon : yellowIcon;
      const m = L.marker([station.lat, station.lng], { icon })
        .addTo(this.map!)
        .bindPopup(
          `<strong>${station.name}</strong><br>${station.bikes} bicis libres`
        );
      this.markers[station.name] = m;
    });

    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  async searchLocation(input: HTMLInputElement) {
    const q = input.value.trim();
    this.location = q || 'Lima';
    this.hasSearched = true;
    this.filteredStations = this.stations.filter(s =>
      s.name.toLowerCase().includes(this.location.toLowerCase())
    );

    if (this.filteredStations.length > 0) {
      this.selectStation(this.filteredStations[0]);
    } else {
      this.selectedStation = null;
      if (this.map && q) {
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
          );
          const data = await resp.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            this.map.setView([parseFloat(lat), parseFloat(lon)], 14);
          }
        } catch (e) {
          console.error('Geocoding failed', e);
        }
      }
    }
  }

  selectStation(station: Station) {
    this.selectedStation = station;
    if (this.map) {
      this.map.setView([station.lat, station.lng], 15);
      const marker = this.markers[station.name];
      if (marker) {
        marker.openPopup();
      }
    }
  }
}
