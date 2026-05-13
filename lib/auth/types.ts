export type UserRole = "customer" | "admin" | "employee" | "manager";

export type UserProfile = {
  id: string;
  auth_user_id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  preferred_language: string | null;
};

export const roleLabels: Record<UserRole, string> = {
  customer: "Customer",
  admin: "Admin",
  employee: "Employee",
  manager: "Manager"
};
