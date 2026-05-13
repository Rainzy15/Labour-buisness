import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";
import type { UserProfile } from "@/lib/auth/types";

export type CustomerRecord = {
  id: string;
  user_id: string;
  customer_type: string;
  notes: string | null;
  marketing_consent: boolean;
};

export type AddressRecord = {
  id: string;
  customer_id: string;
  label: string;
  street: string;
  postcode: string | null;
  city: string | null;
  commune: string | null;
  country: string;
  access_notes: string | null;
  garden_size_sqm: number | null;
  has_narrow_access: boolean;
  has_stairs: boolean;
  has_water_access: boolean;
  parking_notes: string | null;
  is_default: boolean;
};

export type ServiceRecord = {
  id: string;
  name: string;
  category: string;
  season: string | null;
  description: string | null;
  base_price: number | null;
  pricing_unit: string | null;
};

export type BookingRecord = {
  id: string;
  customer_id: string;
  address_id: string | null;
  service_id: string | null;
  status: string;
  requested_date: string | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  estimated_price: number | null;
  final_price: number | null;
  frequency: string | null;
  customer_notes: string | null;
  cancellation_reason: string | null;
  created_at: string;
  services?: { name: string; category: string } | null;
  addresses?: { label: string; commune: string | null; street: string } | null;
};

export async function getOrCreateCustomer(profile: UserProfile): Promise<CustomerRecord | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = createClient();
  const { data: existing } = await supabase.from("customers").select("*").eq("user_id", profile.id).maybeSingle();
  if (existing) return existing as CustomerRecord;

  const { data, error } = await supabase
    .from("customers")
    .insert({ user_id: profile.id, customer_type: "private_homeowner", marketing_consent: false })
    .select("*")
    .single();

  if (error) {
    console.error("Could not create customer record", error.message);
    return null;
  }

  return data as CustomerRecord;
}

export async function getCustomerDashboardData(profile: UserProfile) {
  const customer = await getOrCreateCustomer(profile);
  if (!customer || !hasSupabaseEnv()) {
    return { customer: null, addresses: [], bookings: [], services: [] };
  }

  const supabase = createClient();
  const [addresses, bookings, services] = await Promise.all([
    supabase.from("addresses").select("*").eq("customer_id", customer.id).order("is_default", { ascending: false }),
    supabase
      .from("bookings")
      .select("*, services(name, category), addresses(label, commune, street)")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false }),
    supabase.from("services").select("*").eq("active", true).order("name")
  ]);

  return {
    customer,
    addresses: (addresses.data ?? []) as AddressRecord[],
    bookings: (bookings.data ?? []) as BookingRecord[],
    services: (services.data ?? []) as ServiceRecord[]
  };
}
