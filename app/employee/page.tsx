import { MapPin, Timer } from "lucide-react";
import { StatusBadge } from "@/components/portal/PortalShell";
import { mockBookings } from "@/lib/mockPlatform";

export default function EmployeePage() {
  return (
    <div className="grid gap-4">
      {mockBookings.slice(1, 4).map((job) => (
        <div key={job.id} className="rounded-[28px] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-forest">{job.service}</h2>
              <p className="mt-1 text-sm font-bold text-charcoal/70">{job.customer}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
          <div className="mt-4 grid gap-2 text-sm font-bold text-charcoal/70 sm:grid-cols-2">
            <span className="flex items-center gap-2"><Timer className="h-4 w-4 text-fresh" /> {job.date} at {job.time}</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-fresh" /> Access notes visible in job detail</span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-5">
            {["Accept", "On the way", "Started", "Completed", "Issue reported"].map((action) => (
              <button key={action} className="rounded-full bg-cream px-4 py-3 text-sm font-black text-forest">{action}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
