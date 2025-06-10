import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';

interface UpcomingReservation {
  bike: string;
  date: string;
  time: string;
  address: string;
  imageUrl: string;
}

interface Rental {
  bike: string;
  date: string;
  startStation: string;
  endStation: string;
  status: 'Finalizado' | 'Cancelada' | 'Activa';
}

interface Recommendation {
  bike: string;
  pricePerHour: number;
  distance: string;
  imageUrl: string;
}

@Component({
  selector: 'app-renter-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './renter-home.page.html',
  styleUrls: ['./renter-home.page.css']
})
export class RenterHomePage implements OnInit {
  username = 'Rodrigo';

  // Valores para estadísticas
  distanceTraveled = 54;    // en km
  rentalsCount     = 8;
  drivingTime      = 17;    // en horas
  rating           = 4.8;

  upcoming!: UpcomingReservation;
  recentRentals: Rental[] = [];
  recommendations: Recommendation[] = [];

  ngOnInit(): void {
    // Próxima reserva de ejemplo
    this.upcoming = {
      bike: 'Bike BMX',
      date: '8 de junio',
      time: '3:00 p.m.',
      address: 'Av. Javier Prado 123',
      imageUrl: 'https://cdn.skatepro.com/product/520/mankind-thunder-20-bmx-freestyle-bike-8h.webp'
    };

    // Reservas recientes de ejemplo
    this.recentRentals = [
      { bike: 'Vintage',  date: '5 junio',  startStation: 'Plaza San Miguel', endStation: 'LarcoMar', status: 'Finalizado' },
      { bike: 'Mountain', date: '31 mayo',  startStation: 'UPC - San Miguel',   endStation: 'Rambla',   status: 'Finalizado' },
      { bike: 'BMX',      date: '25 mayo',  startStation: 'Metro - La Marina',   endStation: 'LarcoMar', status: 'Cancelada' },
    ];

    // Recomendaciones de ejemplo
    this.recommendations = [
      { bike: 'Vintage verde', pricePerHour: 3.5, distance: '400 m',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdDydP4N9WKFYaT6cZoxxGCw5kL2BVGseLww&s' },
      { bike: 'Vintage rojo', pricePerHour: 3.8, distance: '600 m',
        imageUrl: 'https://placehold.co/100x75/F1F1F1/333?text=Bike' },
      { bike: 'Mountain X', pricePerHour: 4.2, distance: '800 m',
        imageUrl: 'https://placehold.co/100x75/F1F1F1/333?text=Bike' },
      { bike: 'City Cruiser', pricePerHour: 2.9, distance: '200 m',
        imageUrl: 'https://placehold.co/100x75/F1F1F1/333?text=Bike' }
    ];
  }

  cancelReservation() {
    console.log('Cancelar próxima reserva');
  }

  viewDetails() {
    console.log('Ver detalles de la próxima reserva');
  }

  reserveAgain(rec: Recommendation) {
    console.log('Reservar de nuevo', rec.bike);
  }
}
