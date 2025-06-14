export class Reservation {
  id: number;
  renterName: string;
  renterImage?: string;
  bikeName: string;
  date: Date;
  endDate?: Date;
  totalPrice?: number;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Completed' | 'Cancelled';

  constructor(data: Partial<Reservation> = {}) {
    this.id = data.id || 0;
    this.renterName = data.renterName || '';
    this.renterImage = data.renterImage || 'https://placehold.co/100x100/EFEFEF/333?text=User';
    this.bikeName = data.bikeName || '';
    this.date = data.date || new Date();
    this.endDate = data.endDate;
    this.totalPrice = data.totalPrice;
    this.status = data.status || 'Pending';
  }
}
