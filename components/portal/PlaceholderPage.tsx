import { Plus } from "lucide-react";

export function PlaceholderPage({ title, description, actions = [] }: { title: string; description: string; actions?: string[] }) {
  return (
    <div className="grid gap-5">
      <div className="rounded-[28px] bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-black text-forest">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-charcoal/70">{description}</p>
      </div>
      {actions.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {actions.map((action) => (
            <button key={action} className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white">
              <Plus className="h-4 w-4" /> {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
