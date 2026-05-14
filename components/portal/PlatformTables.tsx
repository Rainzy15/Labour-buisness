import { StatusBadge } from "@/components/portal/PortalShell";

export function SimpleTable({ columns, rows }: { columns: string[]; rows: Array<Record<string, string | number>> }) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
      <div className="hidden gap-3 border-b border-forest/10 bg-forest p-4 text-sm font-black text-white md:grid" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}>
        {columns.map((column) => <span key={column}>{column}</span>)}
      </div>
      {rows.length === 0 && <p className="p-5 text-sm font-bold text-charcoal/65">No records yet.</p>}
      {rows.map((row, index) => (
        <div key={index} className="border-b border-forest/10 p-4 text-sm last:border-0">
          <div className="grid gap-3 md:hidden">
            {columns.map((column) => {
              const key = column.toLowerCase().replaceAll(" ", "");
              const value = row[key] ?? row[column] ?? row[column.toLowerCase()] ?? "";
              return (
                <div key={column} className="flex items-start justify-between gap-4 rounded-2xl bg-cream p-3">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-charcoal/45">{column}</span>
                  <span className="text-right font-bold text-charcoal/75">{column.toLowerCase() === "status" ? <StatusBadge status={String(value)} /> : value}</span>
                </div>
              );
            })}
          </div>
          <div className="hidden gap-3 md:grid" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))` }}>
            {columns.map((column) => {
              const key = column.toLowerCase().replaceAll(" ", "");
              const value = row[key] ?? row[column] ?? row[column.toLowerCase()] ?? "";
              return <span key={column} className="font-bold text-charcoal/75">{column.toLowerCase() === "status" ? <StatusBadge status={String(value)} /> : value}</span>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
