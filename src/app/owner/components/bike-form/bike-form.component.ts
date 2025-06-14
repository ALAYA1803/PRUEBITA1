import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import * as L from 'leaflet';
import { Bike } from '../../model/bike.entity';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bike-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule,
    MatIconModule
  ],
  templateUrl: './bike-form.component.html',
  styleUrls: ['./bike-form.component.css']
})
export class BikeFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() bikeToEdit: Bike | null = null;
  @Output() formSubmitted = new EventEmitter<Bike>();
  @Output() formCancelled = new EventEmitter<void>();

  @ViewChild('formMapContainer') private formMapContainer!: ElementRef;
  private map!: L.Map;
  private marker: L.Marker | null = null;

  bikeForm: FormGroup;
  bikeTypes = ['Urbana', 'Montañera', 'BMX', 'Deportiva', 'Eléctrica'];

  constructor(private fb: FormBuilder) {
    this.bikeForm = this.fb.group({
      model: ['', Validators.required],
      type: ['', Validators.required],
      costPerMinute: [null, [Validators.required, Validators.min(0.1)]],
      imageUrl: ['', Validators.required],
      lat: [null, Validators.required],
      lng: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.bikeToEdit) {
      this.bikeForm.patchValue(this.bikeToEdit);
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  initMap(): void {
    const initialCoords: L.LatLngTuple = this.bikeToEdit
      ? [this.bikeToEdit.lat, this.bikeToEdit.lng]
      : [-12.09, -77.05];

    this.map = L.map(this.formMapContainer.nativeElement).setView(initialCoords, 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    if (this.bikeToEdit) {
      this.updateMarker(initialCoords);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.bikeForm.patchValue({ lat: e.latlng.lat, lng: e.latlng.lng });
      this.updateMarker([e.latlng.lat, e.latlng.lng]);
    });
  }

  updateMarker(coords: L.LatLngTuple): void {
    if (this.marker) {
      this.marker.setLatLng(coords);
    } else {
      this.marker = L.marker(coords).addTo(this.map);
    }
  }

  onSubmit(): void {
    if (this.bikeForm.valid) {
      this.formSubmitted.emit(this.bikeForm.value);
    }
  }

  onCancel(): void {
    this.formCancelled.emit();
  }
}
