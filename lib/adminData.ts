import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

export type AdminBooking = {
  id: string;
  status: string;
  requested_date: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  estimated_price: number | null;
  final_price: number | null;
  frequency: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  cancellation_reason: string | null;
  created_at: string;
  services?: { id: string; name: string; category: string } | null;
  addresses?: { id: string; label: string; street: string; commune: string | null; access_notes: string | null } | null;
  customers?: {
    id: string;
    customer_type: string;
    notes: string | null;
    users_profile?: { first_name: string | null; last_name: string | null; email: string; phone: string | null } | null;
  } | null;
  job_assignments?: Array<{
    id: string;
    status: string;
    employee_notes: string | null;
    employees?: { id: string; first_name: string; last_name: string; phone: string | null } | null;
  }>;
};

export type AdminCustomer = {
  id: string;
  customer_type: string;
  notes: string | null;
  marketing_consent: boolean;
  created_at: string;
  users_profile?: { first_name: string | null; last_name: string | null; email: string; phone: string | null } | null;
  addresses?: Array<{ id: string; label: string; street: string; commune: string | null; garden_size_sqm: number | null }>;
  bookings?: Array<{ id: string; status: string; final_price: number | null; estimated_price: number | null; created_at: string }>;
};

export type AdminEmployee = {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  employment_status: string;
  hourly_rate: number | null;
  skills: string[];
  notes: string | null;
  created_at: string;
  job_assignments?: Array<{ id: string; status: string; booking_id: string; completed_at: string | null }>;
};

export async function getAdminOverviewData() {
  if (!hasSupabaseEnv()) return { bookings: [], customers: [], employees: [], equipment: [], contracts: [], invoices: [] };
  const supabase = createClient();
  const [bookings, customers, employees, equipment, contracts, invoices] = await Promise.all([
    getAdminBookings(),
    getAdminCustomers(),
    getAdminEmployees(),
    supabase.from("equipment").select("*"),
    supabase.from("contracts").select("*"),
    supabase.from("invoices").select("*")
  ]);

  return {
    bookings,
    customers,
    employees,
    equipment: equipment.data ?? [],
    contracts: contracts.data ?? [],
    invoices: invoices.data ?? []
  };
}

export async function getAdminBookings(): Promise<AdminBooking[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, services(id,name,category), addresses(id,label,street,commune,access_notes), customers(id,customer_type,notes,users_profile(first_name,last_name,email,phone)), job_assignments(id,status,employee_notes,employees(id,first_name,last_name,phone))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin bookings query failed", error.message);
    return [];
  }

  return data as AdminBooking[];
}

export async function getAdminBooking(id: string): Promise<AdminBooking | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, services(id,name,category), addresses(id,label,street,commune,access_notes), customers(id,customer_type,notes,users_profile(first_name,last_name,email,phone)), job_assignments(id,status,employee_notes,employees(id,first_name,last_name,phone))")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AdminBooking;
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*, users_profile(first_name,last_name,email,phone), addresses(id,label,street,commune,garden_size_sqm), bookings(id,status,final_price,estimated_price,created_at)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin customers query failed", error.message);
    return [];
  }

  return data as AdminCustomer[];
}

export async function getAdminCustomer(id: string): Promise<AdminCustomer | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*, users_profile(first_name,last_name,email,phone), addresses(id,label,street,commune,garden_size_sqm), bookings(id,status,final_price,estimated_price,created_at)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AdminCustomer;
}

export async function getAdminEmployees(): Promise<AdminEmployee[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("employees")
    .select("*, job_assignments(id,status,booking_id,completed_at)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin employees query failed", error.message);
    return [];
  }

  return data as AdminEmployee[];
}

export async function getAdminEmployee(id: string): Promise<AdminEmployee | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createClient();
  const { data, error } = await supabase.from("employees").select("*, job_assignments(id,status,booking_id,completed_at)").eq("id", id).single();
  if (error) return null;
  return data as AdminEmployee;
}
