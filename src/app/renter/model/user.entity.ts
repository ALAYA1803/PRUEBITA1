export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "renter" | "tenant";

  constructor(user: { id?: number; name?: string; email?: string; password?: string; role?: "renter" | "tenant" }) {
    this.id = user.id || 0;
    this.name = user.name || "Unknown";
    this.email = user.email || "No email";
    this.password = user.password || " ";
    this.role = user.role || "tenant";
  }

}
