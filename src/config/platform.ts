import { Role } from "./roles";
import type { Session } from "@/src/types/auth";

export const platformConfig = {
  name: "JU-TAN Platform",
  version: "1.1",
  documentFolders: ["Pogodbe", "Ponudbe", "PDF", "Specifikacije"] as const,
} as const;

export const mockSession: Session = {
  authenticated: true,
  user: {
    id: "u-01",
    name: "Operater",
    email: "operater@demo.local",
    role: Role.ADMIN,
  },
};
