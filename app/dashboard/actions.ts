"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireProfile } from "@/lib/auth/server";
import { getOrCreateCustomer } from "@/lib/dashboardData";
import { createClient } from "@/lib/supabase/server";

const addressSchema = z.object({
  label: z.string().min(1),
  street: z.string().min(2),
  postcode: z.string().optional(),
  city: z.string().optional(),
  commune: z.string().min(1),
  access_notes: z.string().optional(),
  garden_size_sqm: z.coerce.number().min(1).optional(),
  has_narrow_access: z.coerce.boolean().default(false),
  has_stairs: z.coerce.boolean().default(false),
  has_water_access: z.coerce.boolean().default(false),
  parking_notes: z.string().optional(),
  is_default: z.coerce.boolean().default(false)
});

const bookingSchema = z.object({
  service_id: z.string().uuid(),
  address_id: z.string().uuid(),
  requested_date: z.string().min(1),
  preferred_time: z.string().optional(),
  estimated_price: z.coerce.number().min(0).optional(),
  frequency: z.string().optional(),
  customer_notes: z.string().optional()
});

export type ActionState = { ok: boolean; message: string };

export async function createAddressAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const customer = await getOrCreateCustomer(profile);
  if (!customer) return { ok: false, message: "Customer profile is not ready yet." };

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please complete the required address fields." };

  const supabase = createClient();
  if (parsed.data.is_default) {
    await supabase.from("addresses").update({ is_default: false }).eq("customer_id", customer.id);
  }

  const { error } = await supabase.from("addresses").insert({
    customer_id: customer.id,
    label: parsed.data.label,
    street: parsed.data.street,
    postcode: parsed.data.postcode || null,
    city: parsed.data.city || null,
    commune: parsed.data.commune,
    access_notes: parsed.data.access_notes || null,
    garden_size_sqm: parsed.data.garden_size_sqm || null,
    has_narrow_access: parsed.data.has_narrow_access,
    has_stairs: parsed.data.has_stairs,
    has_water_access: parsed.data.has_water_access,
    parking_notes: parsed.data.parking_notes || null,
    is_default: parsed.data.is_default
  });

  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/addresses");
  revalidatePath("/dashboard/book");
  return { ok: true, message: "Address saved." };
}

export async function deleteAddressAction(formData: FormData) {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const customer = await getOrCreateCustomer(profile);
  const id = String(formData.get("id") ?? "");
  if (!customer || !id) return;

  const supabase = createClient();
  await supabase.from("addresses").delete().eq("id", id).eq("customer_id", customer.id);
  revalidatePath("/dashboard/addresses");
}

export async function createBookingAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const customer = await getOrCreateCustomer(profile);
  if (!customer) return { ok: false, message: "Customer profile is not ready yet." };

  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please select a service, address, and preferred date." };

  const requestedDate = parsed.data.preferred_time ? `${parsed.data.requested_date}T${parsed.data.preferred_time}:00` : null;
  const supabase = createClient();
  const { error } = await supabase.from("bookings").insert({
    customer_id: customer.id,
    service_id: parsed.data.service_id,
    address_id: parsed.data.address_id,
    status: "requested",
    requested_date: parsed.data.requested_date,
    scheduled_start: requestedDate,
    estimated_price: parsed.data.estimated_price || null,
    frequency: parsed.data.frequency || "one-time",
    customer_notes: parsed.data.customer_notes || null
  });

  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/bookings");
  redirect("/dashboard/bookings?created=1");
}

export async function cancelBookingAction(formData: FormData) {
  const profile = await requireProfile(["customer", "admin", "manager"]);
  const customer = await getOrCreateCustomer(profile);
  const id = String(formData.get("id") ?? "");
  const cancellationReason = String(formData.get("cancellation_reason") ?? "Cancelled by customer");
  if (!customer || !id) return;

  const supabase = createClient();
  await supabase
    .from("bookings")
    .update({ status: "cancelled", cancellation_reason: cancellationReason })
    .eq("id", id)
    .eq("customer_id", customer.id);

  revalidatePath("/dashboard/bookings");
}
