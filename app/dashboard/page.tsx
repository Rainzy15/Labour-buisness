import Link from "next/link";
import { CalendarDays, FileText, Leaf, Wrench } from "lucide-react";
import { StatCard } from "@/components/portal/PortalShell";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Upcoming appointments" value="2" detail="Next visit: Friday 09:00" />
        <StatCard label="Active contracts" value="1" detail="Summer Lawn Care Bundle" />
        <StatCard label="Latest invoice" value="€149" detail="Paid on May 1" />
        <StatCard label="Recommended" value="Spring reset" detail="Best seasonal next step" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["/dashboard/book", "Book new service", CalendarDays],
          ["/dashboard/bookings", "View bookings", FileText],
          ["/dashboard/robot-rental", "Rent robot mower", Wrench],
          ["/dashboard/support", "Contact support", Leaf]
        ].map(([href, label, Icon]: any) => (
          <Link key={href} href={href} className="rounded-[26px] bg-white p-6 font-black text-forest shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
            <Icon className="mb-4 h-7 w-7 text-fresh" /> {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
