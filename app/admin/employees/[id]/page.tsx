import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/portal/PortalShell";
import { getAdminEmployee } from "@/lib/adminData";

export default async function AdminEmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = await getAdminEmployee(params.id);
  if (!employee) notFound();
  const completed = employee.job_assignments?.filter((job) => job.status === "completed").length ?? 0;

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-forest">{employee.first_name} {employee.last_name}</h2>
            <p className="mt-2 text-sm text-charcoal/70">{employee.email ?? "No email"} · {employee.phone ?? "No phone"}</p>
          </div>
          <StatusBadge status={employee.employment_status} />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Info label="Hourly rate" value={employee.hourly_rate ? `€${employee.hourly_rate}` : "Not set"} />
          <Info label="Assigned jobs" value={String(employee.job_assignments?.length ?? 0)} />
          <Info label="Completed jobs" value={String(completed)} />
        </div>
        <p className="mt-5 rounded-2xl bg-cream p-4 text-sm text-charcoal/70">Skills: {employee.skills.length ? employee.skills.join(", ") : "Not set"}</p>
      </div>
      <div className="grid gap-3">
        {(employee.job_assignments ?? []).map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <span className="font-bold text-forest">Booking {job.booking_id.slice(0, 8)}</span>
            <StatusBadge status={job.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-cream p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-charcoal/50">{label}</p><p className="mt-1 text-lg font-black text-forest">{value}</p></div>;
}
