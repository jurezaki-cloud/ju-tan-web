export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE" | "CLIENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
