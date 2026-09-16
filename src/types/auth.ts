import type { Role } from "@/src/config/roles";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  firstName?: string;
  lastName?: string;
}

export interface Session {
  authenticated: boolean;
  user: SessionUser | null;
}
