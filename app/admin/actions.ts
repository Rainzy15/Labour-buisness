"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireProfile } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

const bookingUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.string().min(1),
  scheduled_start: z.string().optional(),
  scheduled_end: z.string().optional(),
  final_price: z.coerce.number().min(0).optional(),
  internal_notes: z.string().optional()
});

const assignmentSchema = z.object({
  booking_id: z.string().uuid(),
  employee_id: z.string().uuid()
});

const bookingCreateSchema = z.object({
  customer_id: z.string().uuid(),
  address_id: z.string().uuid().optional().or(z.literal("")),
  service_id: z.string().uuid().optional().or(z.literal("")),
  status: z.string().min(1),
  requested_date: z.string().optional(),
  scheduled_start: z.string().optional(),
  scheduled_end: z.string().optional(),
  estimated_price: z.coerce.number().min(0).optional(),
  final_price: z.coerce.number().min(0).optional(),
  frequency: z.string().optional(),
  customer_notes: z.string().optional(),
  internal_notes: z.string().optional(),
  employee_id: z.string().uuid().optional().or(z.literal(""))
});

const deleteByIdSchema = z.object({
  id: z.string().uuid()
});

const employeeSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  hourly_rate: z.coerce.number().min(0).optional(),
  skills: z.string().optional(),
  notes: z.string().optional()
});

const serviceSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  season: z.string().optional(),
  description: z.string().optional(),
  base_price: z.coerce.number().min(0).optional(),
  pricing_unit: z.string().optional(),
  active: z.string().optional()
});

const equipmentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  purchase_price: z.coerce.number().min(0).optional(),
  purchase_date: z.string().optional(),
  status: z.string().min(1),
  notes: z.string().optional()
});

export async function createBookingAction(formData: FormData) {
  const profile = await requireProfile(["admin", "manager"]);
  const parsed = bookingCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = createClient();
  const payload = {
    customer_id: parsed.data.customer_id,
    address_id: parsed.data.address_id || null,
    service_id: parsed.data.service_id || null,
    status: parsed.data.status,
    requested_date: parsed.data.requested_date || null,
    scheduled_start: parsed.data.scheduled_start || null,
    scheduled_end: parsed.data.scheduled_end || null,
    estimated_price: parsed.data.estimated_price || null,
    final_price: parsed.data.final_price || null,
    frequency: parsed.data.frequency || null,
    customer_notes: parsed.data.customer_notes || null,
    internal_notes: parsed.data.internal_notes || null
  };

  const { data, error } = await supabase.from("bookings").insert(payload).select("id").single();
  if (error || !data) return;

  if (parsed.data.employee_id) {
    await supabase.from("job_assignments").insert({
      booking_id: data.id,
      employee_id: parsed.data.employee_id,
      assigned_by: profile.id,
      status: "assigned"
    });
  }

  await supabase.from("audit_logs").insert({
    actor_user_id: profile.id,
    action: "booking.created_by_admin",
    entity_type: "booking",
    entity_id: data.id,
    metadata_json: payload
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  redirect(`/admin/bookings/${data.id}`);
}

export async function updateBookingAction(formData: FormData) {
  const profile = await requireProfile(["admin", "manager"]);
  const parsed = bookingUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = createClient();
  const payload = {
    status: parsed.data.status,
    scheduled_start: parsed.data.scheduled_start || null,
    scheduled_end: parsed.data.scheduled_end || null,
    final_price: parsed.data.final_price || null,
    internal_notes: parsed.data.internal_notes || null
  };

  await supabase.from("bookings").update(payload).eq("id", parsed.data.id);
  await supabase.from("audit_logs").insert({
    actor_user_id: profile.id,
    action: "booking.updated",
    entity_type: "booking",
    entity_id: parsed.data.id,
    metadata_json: payload
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${parsed.data.id}`);
}

export async function assignEmployeeAction(formData: FormData) {
  const profile = await requireProfile(["admin", "manager"]);
  const parsed = assignmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = createClient();
  await supabase.from("job_assignments").delete().eq("booking_id", parsed.data.booking_id);
  await supabase.from("job_assignments").insert({
    booking_id: parsed.data.booking_id,
    employee_id: parsed.data.employee_id,
    assigned_by: profile.id,
    status: "assigned"
  });

  await supabase.from("audit_logs").insert({
    actor_user_id: profile.id,
    action: "booking.employee_assigned",
    entity_type: "booking",
    entity_id: parsed.data.booking_id,
    metadata_json: { employee_id: parsed.data.employee_id }
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${parsed.data.booking_id}`);
}

export async function deleteBookingAction(formData: FormData) {
  const profile = await requireProfile(["admin", "manager"]);
  const parsed = deleteByIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = createClient();
  await supabase.from("audit_logs").insert({
    actor_user_id: profile.id,
    action: "booking.deleted",
    entity_type: "booking",
    entity_id: parsed.data.id,
    metadata_json: { deleted_from: "admin" }
  });
  await supabase.from("bookings").delete().eq("id", parsed.data.id);

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  redirect("/admin/bookings");
}

export async function createEmployeeAction(formData: FormData) {
  await requireProfile(["admin", "manager"]);
  const parsed = employeeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = createClient();
  await supabase.from("employees").insert({
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    hourly_rate: parsed.data.hourly_rate || null,
    skills: parsed.data.skills ? parsed.data.skills.split(",").map((skill) => skill.trim()).filter(Boolean) : [],
    notes: parsed.data.notes || null,
    employment_status: "active"
  });

  revalidatePath("/admin/employees");
  redirect("/admin/employees");
}

export async function createServiceAction(formData: FormData) {
  await requireProfile(["admin", "manager"]);
  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const supabase = createClient();
  await supabase.from("services").insert({
    name: parsed.data.name,
    category: parsed.data.category,
    season: parsed.data.season || null,
    description: parsed.data.description || null,
    base_price: parsed.data.base_price || null,
    pricing_unit: parsed.data.pricing_unit || null,
    active: parsed.data.active === "on"
  });

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteServiceAction(formData: FormData) {
  await requireProfile(["admin", "manager"]);
  const parsed = deleteByIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = createClient();
  await supabase.from("services").delete().eq("id", parsed.data.id);
  revalidatePath("/admin/services");
}

export async function createEquipmentAction(formData: FormData) {
  await requireProfile(["admin", "manager"]);
  const parsed = equipmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = createClient();
  await supabase.from("equipment").insert({
    name: parsed.data.name,
    type: parsed.data.type,
    brand: parsed.data.brand || null,
    model: parsed.data.model || null,
    serial_number: parsed.data.serial_number || null,
    purchase_price: parsed.data.purchase_price || null,
    purchase_date: parsed.data.purchase_date || null,
    status: parsed.data.status,
    notes: parsed.data.notes || null
  });
  revalidatePath("/admin/equipment");
  redirect("/admin/equipment");
}

export async function deleteEquipmentAction(formData: FormData) {
  await requireProfile(["admin", "manager"]);
  const parsed = deleteByIdSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = createClient();
  await supabase.from("equipment").delete().eq("id", parsed.data.id);
  revalidatePath("/admin/equipment");
}
