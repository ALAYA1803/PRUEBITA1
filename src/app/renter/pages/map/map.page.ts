import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReservationDialogComponent, ReservationDialogData } from '../../../shared/components/reservation-dialog/reservation-dialog.component';

interface Bike {
  id: number;
  owner: string;
  ownerPhoto: string;
  type: string;
  costPerMinute: number;
  lat: number;
  lng: number;
  imageUrl: string;
  distance?: number;
}

const FALLBACK_OWNER = 'https://media.istockphoto.com/id/1171169099/es/foto/hombre-con-brazos-cruzados-aislados-sobre-fondo-gris.jpg?s=612x612&w=0&k=20&c=8qDLKdLMm2i8DHXY6crX6a5omVh2IxqrOxJV2QGzgFg=';
const FALLBACK_BIKE  = 'https://www.monark.com.pe/static/monark-pe/uploads/products/images/bicicleta-monark-highlander-xt-aro-29-rojo-negro-01.jpg';

const BIKES: Bike[] = [
  { id: 1, owner: 'Luis Alaya', ownerPhoto: 'https://randomuser.me/api/portraits/men/32.jpg', type: 'BMX', costPerMinute: 0.5, lat: -12.1050, lng: -77.0350, imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp' },
  { id: 2, owner: 'María Pérez', ownerPhoto: 'https://randomuser.me/api/portraits/women/44.jpg', type: 'Montañera', costPerMinute: 0.8, lat: -12.0790, lng: -77.0870, imageUrl: 'https://images.squarespace-cdn.com/content/v1/5c38c1a931d4dfa4282305a3/1547225184651-S2PO613H621C4G57EX7D/specialized-pitch-sport-womens-hardtail-mountain-bike-2019-gloss-storm-grey-acid-lava.jpg' },
  { id: 3, owner: 'Carlos Ruiz', ownerPhoto: 'https://randomuser.me/api/portraits/men/56.jpg', type: 'Urbana', costPerMinute: 0.4, lat: -12.1210, lng: -77.0300, imageUrl: FALLBACK_BIKE },
  { id: 4, owner: 'Ana Gómez', ownerPhoto: 'https://randomuser.me/api/portraits/women/68.jpg', type: 'Deportiva', costPerMinute: 0.9, lat: -12.0960, lng: -77.0440, imageUrl: 'https://i.ebayimg.com/images/g/5O4AAOSw~-dlNVKg/s-l1600.jpg' },
  { id: 5, owner: 'Juan Soto', ownerPhoto: 'https://randomuser.me/api/portraits/men/72.jpg', type: 'BMX', costPerMinute: 0.5, lat: -12.1050, lng: -76.9630, imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp' }
];

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MatDialogModule, MatSnackBarModule, DecimalPipe],
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.css']
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) private mapContainer!: ElementRef<HTMLDivElement>;
  private map!: L.Map;
  private markersLayer = L.layerGroup();

  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  bikes = BIKES;
  bikeTypes: string[] = [];
  priceLabels = ['Todos', '≤ S/ 0.5', 'S/ 0.5 – 0.8', '> S/ 0.8'];
  priceRanges = [
    { label: 'Todos', min: 0, max: Infinity },
    { label: '≤ S/ 0.5', min: 0, max: 0.5 },
    { label: 'S/ 0.5 – 0.8', min: 0.5, max: 0.8 },
    { label: '> S/ 0.8', min: 0.8, max: Infinity }
  ];

  filteredBikes: Bike[] = [];
  selectedBike: Bike | null = null;

  ngOnInit(): void {
    this.bikeTypes = Array.from(new Set(this.bikes.map(b => b.type)));
    this.filteredBikes = [...this.bikes];
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.updateMarkers();
    setTimeout(() => this.map.invalidateSize(), 200);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  openReservationDialog(): void {
    if (!this.selectedBike) return;
    const dialogData: ReservationDialogData = {
      bikeName: `${this.selectedBike.type} de ${this.selectedBike.owner}`,
      pricePerMinute: this.selectedBike.costPerMinute,
      imageUrl: this.selectedBike.imageUrl
    };
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.snackBar.open(`¡Has reservado la ${this.selectedBike?.type} de ${this.selectedBike?.owner}!`, 'OK', { duration: 3000 });
        this.selectedBike = null;
      }
    });
  }

  onOwnerImageError(event: Event) { (event.target as HTMLImageElement).src = FALLBACK_OWNER; }
  onBikeImageError(event: Event) { (event.target as HTMLImageElement).src = FALLBACK_BIKE; }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, { center: [-12.09, -77.05], zoom: 14 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(this.map);
    this.markersLayer.addTo(this.map);
  }
  applyFilters(district: string, type: string, priceLabel: string) {
    this.selectedBike = null;
    if (district.trim()) {
      this.searchDistrict(district.trim());
    }
    let list = [...this.bikes];
    if (type) {
      list = list.filter(b => b.type === type);
    }
    const prLabel = priceLabel || 'Todos';
    const pr = this.priceRanges.find(p => p.label === prLabel)!;
    list = list.filter(b => b.costPerMinute >= pr.min && b.costPerMinute < pr.max);

    const center: [number, number] = [this.map.getCenter().lat, this.map.getCenter().lng];
    this.filteredBikes = list
      .map(b => ({ ...b, distance: this.haversine(center, [b.lat, b.lng]) }))
      .sort((a, b) => (a.distance! - b.distance!));

    this.updateMarkers();
  }

  private updateMarkers() {
    this.markersLayer.clearLayers();
    this.filteredBikes.forEach(b => {
      const icon = L.icon({ iconUrl: 'assets/img/map-marker.svg', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
      const marker = L.marker([b.lat, b.lng], { icon }).addTo(this.markersLayer)
        .bindPopup(`<b>${b.owner}</b><br>${b.type}`);
      marker.on('click', () => {
        this.ngZone.run(() => {
          this.selectBike(b);
          this.cdr.detectChanges();
        });
      });
    });
  }

  selectBike(b: Bike) {
    this.selectedBike = b;
    this.map.flyTo([b.lat, b.lng], 16);
  }

  private searchDistrict(query: string) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Lima, Peru')}`)
      .then(r => r.json())
      .then((res: any[]) => {
        if (res.length > 0) {
          const lat = parseFloat(res[0].lat);
          const lng = parseFloat(res[0].lon);
          this.map.setView([lat, lng], 14);
        }
      })
      .catch(console.error);
  }

  private haversine([lat1, lon1]: number[], [lat2, lon2]: number[]): number {
    const toRad = (x: number) => x * Math.PI / 180;
    const R = 6371e3;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
