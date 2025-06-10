export class Profile {
  id: number;
  userId: number;
  address: string;
  profileImage: string;
  phone: string;
  paymentMethod: string;
  preferredBikeType: string;
  notifications: boolean;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.userId = data.userId || 0;
    this.address = data.address || '';
    this.profileImage = data.profileImage || '';
    this.phone = data.phone || '';
    this.paymentMethod = data.paymentMethod || '';
    this.preferredBikeType = data.preferredBikeType || '';
    this.notifications = data.notifications || false;
  }
}
