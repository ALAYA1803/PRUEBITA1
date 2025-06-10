export class User {
  id: number;
  name: string;
  email: string;

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.email = data.email || '';
  }
}
