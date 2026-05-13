import Link from "next/link";
import { areas, navItems } from "@/lib/data";
import { Sprout } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-2 text-xl font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-lime text-forest">
              <Sprout className="h-5 w-5" />
            </span>
            LuxLawn Care
          </div>
          <p className="max-w-md text-sm leading-7 text-white/72">
            Simple, seasonal garden care with clear pricing before we visit. Lawn mowing, hedge care, pressure washing, winter salting, and robot mower rental across Luxembourg.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-lime">Pages</h2>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link className="text-sm text-white/75 hover:text-lime" key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-lime">Service Areas</h2>
          <p className="text-sm leading-7 text-white/72">{areas.join(" · ")} · Other areas on request.</p>
        </div>
      </div>
    </footer>
  );
}
