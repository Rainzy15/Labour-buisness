import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`relative px-4 py-16 sm:px-6 lg:px-8 ${className}`}>{children}</section>;
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.2em] text-fresh">{children}</p>;
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" }) {
  const styles =
    variant === "primary"
      ? "bg-forest text-white hover:bg-charcoal"
      : variant === "secondary"
        ? "bg-white text-forest hover:bg-lime"
        : "bg-transparent text-forest hover:bg-white/60";
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold shadow-sm transition ${styles}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function MotionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] border border-forest/10 bg-white p-6 shadow-glass transition duration-200 hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
}

export function FieldLabel({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label className="text-sm font-extrabold text-forest">{label}</label>
      {value !== undefined && <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-charcoal">{value}</span>}
    </div>
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-lime/40 ${props.className ?? ""}`} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-forest/10 bg-white px-4 py-3 text-left text-sm font-bold text-forest"
      aria-pressed={checked}
    >
      {label}
      <span className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-fresh" : "bg-forest/15"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}
