export enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
  CLIENT = "CLIENT",
}

export const roleLabels: Record<Role, string> = {
  [Role.OWNER]: "Owner",
  [Role.ADMIN]: "Admin",
  [Role.MANAGER]: "Manager",
  [Role.EMPLOYEE]: "Employee",
  [Role.CLIENT]: "Client",
};
