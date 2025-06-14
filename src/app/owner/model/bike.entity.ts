export class Bike {
  id: number;
  model: string;
  type: string;
  rentalsThisMonth: number;
  imageUrl: string;
  lat: number;
  lng: number;
  costPerMinute: number;

  constructor(data: Partial<Bike> = {}) {
    this.id = data.id || 0;
    this.model = data.model || '';
    this.type = data.type || '';
    this.rentalsThisMonth = data.rentalsThisMonth || 0;
    this.imageUrl = data.imageUrl || '';
    this.lat = data.lat || 0;
    this.lng = data.lng || 0;
    this.costPerMinute = data.costPerMinute || 0;
  }
}
