export class OwnerProfile {
  id: number;
  userId: number;
  publicBio: string;
  isVerified: boolean;
  payoutEmail: string;

  constructor(data: Partial<OwnerProfile> = {}) {
    this.id = data.id || 0;
    this.userId = data.userId || 0;
    this.publicBio = data.publicBio || '';
    this.isVerified = data.isVerified || false;
    this.payoutEmail = data.payoutEmail || '';
  }
}
