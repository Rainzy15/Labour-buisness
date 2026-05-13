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

const employeeSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  hourly_rate: z.coerce.number().min(0).optional(),
  skills: z.string().optional(),
  notes: z.string().optional()
});

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
