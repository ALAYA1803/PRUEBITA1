import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import * as L from 'leaflet';

import { BikeFormComponent } from '../../components/bike-form/bike-form.component';
import { Bike } from '../../model/bike.entity';
import { BikeService } from '../../service/bike.service';

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

  loading = false;
  error = false;
  constructor(private cdr: ChangeDetectorRef, private bikeService: BikeService) {}

  ngOnInit(): void {
    this.loadOwnerBikes();
  }
  ngOnDestroy(): void {
    this.map?.remove();
  }

  loadOwnerBikes(): void {
    this.loading = true;
    this.error = false;
    this.bikeService.getOwnerBikes().subscribe({
      next: bikes => {
        this.myBikes = bikes;
        this.updateMarkers();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
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
