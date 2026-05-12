import type { Role } from "@/types/domain";

export type Permission =
  | "viewAdmin"
  | "manageCatalog"
  | "manageStock"
  | "manageUsers"
  | "viewReports"
  | "configureCompany"
  | "operatePdv"
  | "manageKitchen"
  | "createOrders"
  | "viewMenu";

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    "viewAdmin",
    "manageCatalog",
    "manageStock",
    "manageUsers",
    "viewReports",
    "configureCompany",
    "operatePdv",
    "manageKitchen",
    "createOrders",
    "viewMenu",
  ],
  CAIXA: ["operatePdv", "createOrders", "viewMenu"],
  COZINHA: ["manageKitchen"],
  ATENDENTE: ["createOrders", "viewMenu", "operatePdv"],
};

export function hasPermission(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

