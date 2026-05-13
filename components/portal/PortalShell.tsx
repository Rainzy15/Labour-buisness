import Link from "next/link";
import { CalendarDays, FileText, Home, LayoutDashboard, MessageSquare, Settings, ShieldCheck, Users, Wrench } from "lucide-react";
import type { UserProfile } from "@/lib/auth/types";

export type PortalNavItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export const customerNav: PortalNavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/book", label: "Book Service", icon: CalendarDays },
  { href: "/dashboard/bookings", label: "My Bookings", icon: FileText },
  { href: "/dashboard/history", label: "Service History", icon: Home },
  { href: "/dashboard/contracts", label: "Contracts", icon: ShieldCheck },
  { href: "/dashboard/robot-rental", label: "Robot Rental", icon: Wrench },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/addresses", label: "Addresses", icon: Home },
  { href: "/dashboard/support", label: "Support", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export const adminNav: PortalNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/contracts", label: "Contracts", icon: ShieldCheck },
  { href: "/admin/invoices", label: "Invoices", icon: FileText },
  { href: "/admin/robot-rentals", label: "Robot Rentals", icon: Wrench },
  { href: "/admin/equipment", label: "Equipment", icon: Wrench },
  { href: "/admin/services", label: "Services", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export const employeeNav: PortalNavItem[] = [
  { href: "/employee", label: "Today", icon: LayoutDashboard },
  { href: "/employee/jobs", label: "Upcoming Jobs", icon: CalendarDays },
  { href: "/employee/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/employee/issues", label: "Issues", icon: MessageSquare },
  { href: "/employee/profile", label: "Profile", icon: Settings }
];

export function PortalShell({ title, subtitle, profile, nav, children }: { title: string; subtitle: string; profile: UserProfile; nav: PortalNavItem[]; children: React.ReactNode }) {
  return (
    <section className="bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[30px] bg-forest p-4 text-white shadow-premium lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lime">LuxLawn Care</p>
            <p className="mt-2 text-lg font-black">{profile.first_name || "Account"} {profile.last_name || ""}</p>
            <p className="text-sm text-white/65">{profile.email}</p>
          </div>
          <nav className="mt-4 grid gap-2" aria-label={`${title} navigation`}>
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-white/78 transition hover:bg-white/10 hover:text-white">
                  {Icon && <Icon className="h-4 w-4 text-lime" />} {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div>
          <div className="mb-6 rounded-[30px] bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-fresh">{title}</p>
            <h1 className="mt-2 text-4xl font-black text-forest">{subtitle}</h1>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[26px] bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-charcoal/60">{label}</p>
      <p className="mt-2 text-3xl font-black text-forest">{value}</p>
      <p className="mt-1 text-sm text-charcoal/65">{detail}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const color = status.includes("completed") || status.includes("paid") || status.includes("active") ? "bg-fresh/15 text-forest" : status.includes("cancel") || status.includes("overdue") ? "bg-red-50 text-red-700" : "bg-lime/40 text-forest";
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${color}`}>{status.replaceAll("_", " ")}</span>;
}
