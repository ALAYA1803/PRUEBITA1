import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';

interface Stat {
  label: string;
  value: string;
  suffix?: string;
  isRating?: boolean;
}

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
  endStation:string;
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
  stats: Stat[] = [];
  upcoming!: UpcomingReservation;
  recentRentals: Rental[] = [];
  recommendations: Recommendation[] = [];

  ngOnInit(): void {
    // Estadísticas de ejemplo
    this.stats = [
      { label: 'Has recorrido',         value: '54', suffix: 'km' },
      { label: 'Alquileres realizados', value: '8' },
      { label: 'Tiempo de manejo',      value: '17', suffix: 'h' },
      { label: 'Tu rating como arrendatario', value: '4.8', isRating: true },
    ];

    // Próxima reserva de ejemplo
    this.upcoming = {
      bike: 'Bike BMX',
      date: '8 de junio',
      time: '3:00 p.m',
      address: 'Av. Javier Prado 123',
      imageUrl: 'https://placehold.co/200x150/F1F1F1/333?text=Bike+BMX'
    };

    // Reservas recientes de ejemplo
    this.recentRentals = [
      { bike: 'Vintage',  date: '5 junio',  startStation: 'Plaza San Miguel', endStation: 'LarcoMar', status: 'Finalizado' },
      { bike: 'Mountain', date: '31 mayo',  startStation: 'UPC - San Miguel',   endStation: 'Rambla',   status: 'Finalizado' },
      { bike: 'BMX',      date: '25 mayo',  startStation: 'Metro - La Marina',   endStation: 'LarcoMar', status: 'Cancelada' },
    ];

    // Recomendaciones de ejemplo
    this.recommendations = [
      {
        bike: 'Vintage verde',
        pricePerHour: 3.50,
        distance: '400 m',
        imageUrl: 'https://placehold.co/100x75/F1F1F1/333?text=Bike'
      },
      {
        bike: 'Vintage verde',
        pricePerHour: 3.50,
        distance: '400 m',
        imageUrl: 'https://placehold.co/100x75/F1F1F1/333?text=Bike'
      },
      {
        bike: 'Vintage verde',
        pricePerHour: 3.50,
        distance: '400 m',
        imageUrl: 'https://placehold.co/100x75/F1F1F1/333?text=Bike'
      },
      {
        bike: 'Vintage verde',
        pricePerHour: 3.50,
        distance: '400 m',
        imageUrl: 'https://placehold.co/100x75/F1F1F1/333?text=Bike'
      }
    ];
  }

  cancelReservation() {
    // implementar lógica de cancelación
    console.log('Cancelar próxima reserva');
  }

  viewDetails() {
    // implementar lógica de ver detalles
    console.log('Ver detalles de la próxima reserva');
  }

  reserveAgain(rec: Recommendation) {
    // implementar lógica de nueva reserva
    console.log('Reservar de nuevo', rec.bike);
  }
}
