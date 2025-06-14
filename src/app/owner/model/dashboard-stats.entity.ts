export class DashboardStats {
  monthlyIncome: number;
  pendingReservationsCount: number;
  activeBikesCount: number;
  ownerRating: number;

  constructor(data: Partial<DashboardStats> = {}) {
    this.monthlyIncome = data.monthlyIncome || 0;
    this.pendingReservationsCount = data.pendingReservationsCount || 0;
    this.activeBikesCount = data.activeBikesCount || 0;
    this.ownerRating = data.ownerRating || 0;
  }
}
