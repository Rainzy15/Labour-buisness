import { serviceSections } from "@/lib/data";
import { ButtonLink, Container, Eyebrow, MotionCard, Section } from "@/components/ui";

export default function ServicesPage() {
  const allServices = serviceSections.flatMap((section) => section.items.map(([title, text, price, Icon]: any) => ({ title, text, price, Icon, season: section.title.replace(" Services", "") })));

  return (
    <Section className="bg-cream">
      <Container>
        <div className="mb-10 max-w-3xl">
          <Eyebrow>Season by season</Eyebrow>
          <h1 className="text-4xl font-black text-forest sm:text-5xl">Services for Every Season</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/70">Garden needs change throughout the year, so our services are organized by season for clear planning and fair pricing.</p>
        </div>

        <section className="mb-14 rounded-[32px] bg-white p-5 shadow-premium sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-forest">All services</h2>
              <p className="mt-2 text-sm leading-6 text-charcoal/70">Quickly browse every active service, then calculate a price or add several services to one booking request.</p>
            </div>
            <ButtonLink href="/dashboard/book">Build a booking</ButtonLink>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allServices.map(({ title, price, Icon, season }) => (
              <div key={`${season}-${title}`} className="flex items-center gap-3 rounded-[22px] border border-forest/10 bg-cream/70 p-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-lime text-forest"><Icon className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-forest">{title}</p>
                  <p className="text-xs font-bold text-charcoal/55">{season} · {price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-12">
          {serviceSections.map((section) => (
            <section key={section.title}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-forest">{section.title}</h2>
                  <p className="mt-2 text-charcoal/70">{section.intro}</p>
                </div>
                <ButtonLink href="/pricing">Estimate this season</ButtonLink>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map(([title, text, price, Icon]: any) => (
                  <MotionCard key={title}>
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-lime text-forest"><Icon className="h-6 w-6" /></div>
                    <h3 className="text-xl font-black text-forest">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-charcoal/70">{text}</p>
                    <p className="mt-4 rounded-2xl bg-cream p-3 text-sm font-black text-forest">{price}</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <ButtonLink href="/pricing" variant="ghost">Estimate</ButtonLink>
                      <ButtonLink href="/dashboard/book" variant="secondary">Book</ButtonLink>
                    </div>
                  </MotionCard>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
