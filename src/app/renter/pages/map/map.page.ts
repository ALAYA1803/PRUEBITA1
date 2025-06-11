import { Component, OnInit, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, ChangeDetectorRef, NgZone }
  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as L           from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const FALLBACK_OWNER = 'https://placehold.co/50x50/EFEFEF/333?text=OW';
const FALLBACK_BIKE  = 'https://placehold.co/200x150/CCCCCC/FFFFFF?text=BK';

const BIKES: Bike[] = [
  {
    id: 1,
    owner: 'Luis Alaya',
    ownerPhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'BMX',
    costPerMinute: 3.1,
    lat: -12.1050,
    lng: -77.0350,
    imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp',
  },
  {
    id: 2,
    owner: 'María Pérez',
    ownerPhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
    type: 'Mountain',
    costPerMinute: 2.8,
    lat: -12.0790,
    lng: -77.0870,
    imageUrl: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=60',
  },
  {
    id: 3,
    owner: 'Carlos Ruiz',
    ownerPhoto: 'https://randomuser.me/api/portraits/men/56.jpg',
    type: 'BMX',
    costPerMinute: 3.0,
    lat: -12.1210,
    lng: -77.0300,
    imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp',
  },
  {
    id: 4,
    owner: 'Ana Gómez',
    ownerPhoto: 'https://randomuser.me/api/portraits/women/68.jpg',
    type: 'Road',
    costPerMinute: 4.2,
    lat: -12.0960,
    lng: -77.0440,
    imageUrl: 'https://images.unsplash.com/photo-1520975958722-472f7ec478c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=60',
  },
  {
    id: 5,
    owner: 'Juan Soto',
    ownerPhoto: 'https://randomuser.me/api/portraits/men/72.jpg',
    type: 'BMX',
    costPerMinute: 3.3,
    lat: -12.1050,
    lng: -76.9630,
    imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp',
  }
];

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.css']
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) private mapContainer!: ElementRef<HTMLDivElement>;
  private map!: L.Map;
  private markersLayer = L.layerGroup();

  bikes = BIKES;
  bikeTypes: string[] = [];
  priceRanges = [
    { label: 'Todos',    min: 0,    max: Infinity },
    { label: '≤ S/ 3',   min: 0,    max: 3 },
    { label: 'S/ 3 – 4', min: 3,    max: 4 },
    { label: '> S/ 4',   min: 4,    max: Infinity }
  ];
  priceLabels = ['Todos', '≤ S/ 3', 'S/ 3 – 4', '> S/ 4'];

  filteredBikes: Bike[] = [];
  hasSearched = false;
  selectedType = '';
  selectedPriceLabel = '';
  selectedBike: Bike | null = null;
  typeCounts: { type: string; count: number }[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.bikeTypes = Array.from(new Set(this.bikes.map(b => b.type)));
    this.typeCounts = this.bikeTypes.map(t => ({
      type: t,
      count: this.bikes.filter(b => b.type === t).length
    }));
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.filteredBikes = [...this.bikes];
    this.updateMarkers();
    setTimeout(() => this.map.invalidateSize(), 200);
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  onOwnerImageError(event: Event) {
    (event.target as HTMLImageElement).src = FALLBACK_OWNER;
  }

  onBikeImageError(event: Event) {
    (event.target as HTMLImageElement).src = FALLBACK_BIKE;
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [-12.10, -77.04],
      zoom: 12
    });
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(this.map);
    this.markersLayer.addTo(this.map);
  }

  applyFilters(district: string, type: string, priceLabel: string) {
    this.hasSearched = true;
    this.selectedType = type;
    this.selectedPriceLabel = priceLabel || 'Todos';
    this.selectedBike = null;

    if (district.trim()) {
      this.searchDistrict(district.trim());
    }

    const ctr = this.map.getCenter();
    const center: [number, number] = [ctr.lat, ctr.lng];

    let list = [...this.bikes];
    if (this.selectedType) {
      list = list.filter(b => b.type === this.selectedType);
    }
    const pr = this.priceRanges.find(p => p.label === this.selectedPriceLabel)!;
    list = list.filter(b => b.costPerMinute >= pr.min && b.costPerMinute <= pr.max);

    this.filteredBikes = list
      .map(b => ({ ...b, distance: this.haversine(center, [b.lat, b.lng]) }))
      .sort((a, b) => (a.distance! - b.distance!));

    this.updateMarkers();
  }

  private updateMarkers() {
    this.markersLayer.clearLayers();
    this.filteredBikes.forEach(b => {
      const icon = L.icon({
        iconUrl: 'assets/img/map-marker.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
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
    this.map.setView([b.lat, b.lng], 15);
  }

  private searchDistrict(query: string) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Lima, Peru')}`)
      .then(r => r.json())
      .then((res: any[]) => {
        if (res.length) {
          const lat = parseFloat(res[0].lat),
            lng = parseFloat(res[0].lon);
          this.map.setView([lat, lng], 13);
        }
      })
      .catch(console.error);
  }

  private haversine([lat1, lon1]: number[], [lat2, lon2]: number[]): number {
    const toRad = (x: number) => x * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 +
      Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000;
  }
}
