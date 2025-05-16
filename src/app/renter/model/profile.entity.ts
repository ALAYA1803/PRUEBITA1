export class Profile {
  id: number;
  userId: number;
  profileImage: string;
  address: string;
  rating: number;
  preferences: {
    notifications: boolean,
  };
  paymentMethods: {
    creditCard: boolean,
    paypal: boolean
  };

  constructor(profile: {
    id?: number;
    userId?: number,
    profileImage?: string,
    address?: string,
    rating?: number,
    preferences?: { notifications: boolean };
    paymentMethods?: { creditCard: boolean; paypal: boolean };
  }) {
    this.id = profile.id || 0;
    this.userId = profile.userId || 0;
    this.profileImage = profile.profileImage || " ";
    this.address = profile.address || "";
    this.rating = profile.rating || 1;
    this.preferences = profile.preferences || { notifications: true };
    this.paymentMethods = profile.paymentMethods || { creditCard: true, paypal: false };
  }
}
