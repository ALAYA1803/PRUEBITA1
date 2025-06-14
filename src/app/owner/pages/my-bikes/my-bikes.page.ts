import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import * as L from 'leaflet';

import { BikeFormComponent } from '../../components/bike-form/bike-form.component';
import { Bike } from '../../model/bike.entity';

@Component({
  selector: 'app-my-bikes-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule, BikeFormComponent],
  templateUrl: './my-bikes.page.html',
  styleUrls: ['./my-bikes.page.css']
})
export class MyBikesPage implements OnInit, OnDestroy {
  @ViewChild('mapContainer') set mapContainer(container: ElementRef | undefined) {
    if (container) {
      this._mapContainer = container;
      this.initMap();
    }
  }
  private _mapContainer!: ElementRef;

  private map!: L.Map;
  private markersLayer = L.layerGroup();

  myBikes: Bike[] = [];
  selectedBike: Bike | null = null;
  isEditing = false;

  private bikeIcon = L.icon({
    iconUrl: 'assets/img/map-marker.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -40]
  });

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOwnerBikes();
  }
  ngOnDestroy(): void {
    this.map?.remove();
  }

  loadOwnerBikes(): void {
    this.myBikes = [
      new Bike({ id: 101, model: 'BMX Pro', type: 'BMX', costPerMinute: 0.5, imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp', lat: -12.085, lng: -77.050 }),
      new Bike({ id: 102, model: 'Vintage Verde', type: 'Urbana', costPerMinute: 0.3, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdDydP4N9WKFYaT6cZoxxGCw5kL2BVGseLww&s', lat: -12.095, lng: -77.045 }),
      new Bike({ id: 103, model: 'Mountain X', type: 'Montañera', costPerMinute: 0.6, imageUrl: 'https://images.squarespace-cdn.com/content/v1/5c38c1a931d4dfa4282305a3/1547225184651-S2PO613H621C4G57EX7D/specialized-pitch-sport-womens-hardtail-mountain-bike-2019-gloss-storm-grey-acid-lava.jpg', lat: -12.090, lng: -77.060 }),
    ];
  }
  initMap(): void {
    this.map?.remove();
    if (!this._mapContainer) return;

    this.map = L.map(this._mapContainer.nativeElement).setView([-12.09, -77.05], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.markersLayer.addTo(this.map);
    this.updateMarkers();
  }

  updateMarkers(): void {
    this.markersLayer.clearLayers();
    this.myBikes.forEach(bike => {
      L.marker([bike.lat, bike.lng], { icon: this.bikeIcon })
        .addTo(this.markersLayer)
        .bindPopup(`<b>${bike.model}</b><br>${bike.type}`);
    });
  }

  selectBike(bike: Bike): void {
    this.selectedBike = bike;
    this.map.flyTo([bike.lat, bike.lng], 16);
  }

  showAddForm(): void {
    this.selectedBike = null;
    this.isEditing = true;
  }

  showEditForm(bike: Bike): void {
    this.selectedBike = bike;
    this.isEditing = true;
  }

  handleFormSubmit(bikeData: Bike): void {
    if (this.selectedBike) {
      const index = this.myBikes.findIndex(b => b.id === this.selectedBike!.id);
      this.myBikes[index] = { ...this.selectedBike, ...bikeData };
      console.log('Bicicleta actualizada:', this.myBikes[index]);
    } else {
      const newBike = new Bike({ ...bikeData, id: Date.now() });
      this.myBikes.push(newBike);
      console.log('Nueva bicicleta añadida:', newBike);
    }
    this.isEditing = false;
  }

  handleFormCancel(): void {
    this.isEditing = false;
  }
}
