import Link from "next/link";
import { createEmployeeAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/portal/PortalShell";
import { getAdminEmployees } from "@/lib/adminData";

export default async function AdminEmployeesPage() {
  const employees = await getAdminEmployees();

  return (
    <div className="grid gap-6">
      <form action={createEmployeeAction} className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-forest">Add employee</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="first_name" label="First name" required />
          <Input name="last_name" label="Last name" required />
          <Input name="email" label="Email" type="email" />
          <Input name="phone" label="Phone" />
          <Input name="hourly_rate" label="Hourly rate" type="number" />
          <Input name="skills" label="Skills comma-separated" placeholder="mowing, hedges, winter" />
        </div>
        <textarea name="notes" placeholder="Internal employee notes" className="min-h-24 rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
        <button className="rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Add employee</button>
      </form>
      <div className="grid gap-4">
        {employees.length === 0 && <p className="rounded-[28px] bg-white p-6 text-sm font-bold text-charcoal/70 shadow-sm">No employees yet.</p>}
        {employees.map((employee) => (
          <Link key={employee.id} href={`/admin/employees/${employee.id}`} className="block rounded-[28px] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-forest">{employee.first_name} {employee.last_name}</h2>
                <p className="mt-1 text-sm text-charcoal/70">{employee.email ?? "No email"} · {employee.phone ?? "No phone"}</p>
              </div>
              <StatusBadge status={employee.employment_status} />
            </div>
            <p className="mt-3 text-sm text-charcoal/70">Skills: {employee.skills.length ? employee.skills.join(", ") : "Not set"} · Jobs: {employee.job_assignments?.length ?? 0}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <input {...inputProps} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
    </label>
  );
}
