"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgeCheck, CheckCircle2, Star } from "lucide-react";
import { bundles, quickStats, seasons, testimonials, trustBadges } from "@/lib/data";
import { calculateLawn, eur } from "@/lib/pricing";
import { ButtonLink, Container, Eyebrow, FieldLabel, MotionCard, Section, Select } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickEstimate />
      <div className="grass-divider" />
      <SeasonalServices />
      <RobotTeaser />
      <BundlesPreview />
      <BeforeAfter />
      <Testimonials />
      <Section className="bg-forest text-white">
        <Container className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Eyebrow>Fair local quotes</Eyebrow>
            <h2 className="text-4xl font-black">Tell us your garden size and we'll give you a fair quote.</h2>
            <p className="mt-4 max-w-2xl text-white/72">Send a few photos, your commune, and what you need. We'll reply with a practical estimate for your Luxembourg property.</p>
          </div>
          <ButtonLink href="/contact" variant="secondary">Book a visit</ButtonLink>
        </Container>
      </Section>
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[86vh] overflow-hidden bg-grass bg-cover bg-center px-4 py-20 text-white sm:px-6 lg:px-8">
      <span className="season-orb left-10 top-24 h-40 w-40 bg-lime" />
      <span className="season-orb bottom-24 right-24 h-56 w-56 bg-fresh" />
      <Container className="grid min-h-[68vh] items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-white/18 px-4 py-2 text-sm font-extrabold backdrop-blur">Local Luxembourg garden service</p>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.02] sm:text-7xl">Smart Lawn & Seasonal Garden Care in Luxembourg</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">From weekly mowing to winter salting and robot mower rental, get transparent estimates in seconds.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/pricing" variant="secondary">Calculate my price</ButtonLink>
            <ButtonLink href="/services" variant="ghost">Explore services</ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {trustBadges.map((badge) => (
              <span key={badge} className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-bold backdrop-blur">
                <BadgeCheck className="h-4 w-4 text-lime" /> {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="glass rounded-[34px] p-5 text-forest">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-fresh">Typical estimates</p>
          <div className="mt-4 grid gap-3">
            {quickStats.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-3xl bg-white/80 p-4">
                <span className="font-bold">{label}</span>
                <strong className="text-xl">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function QuickEstimate() {
  const [size, setSize] = useState(250);
  const [season, setSeason] = useState("Summer");
  const [service, setService] = useState("Lawn care");
  const estimate = useMemo(() => calculateLawn({ size, frequency: "oneTime", grass: season === "Spring" ? "long" : "normal", edge: service.includes("Lawn"), collection: false, waste: false, terrain: "easy", access: "easy" }), [size, season, service]);
  return (
    <Section className="bg-cream">
      <Container>
        <div className="grid gap-8 rounded-[36px] bg-white p-6 shadow-premium lg:grid-cols-[.8fr_1.2fr] lg:p-8">
          <div>
            <Eyebrow>Quick Estimate</Eyebrow>
            <h2 className="text-4xl font-black text-forest">A realistic price in a few seconds.</h2>
            <p className="mt-4 text-charcoal/70">Choose your service, adjust the sliders, and get a realistic estimate instantly.</p>
          </div>
          <div className="grid gap-4">
            <div>
              <FieldLabel label="Lawn size" value={`${size} m²`} />
              <input className="range w-full" type="range" min={50} max={1000} value={size} onChange={(e) => setSize(Number(e.target.value))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select value={season} onChange={(e) => setSeason(e.target.value)} aria-label="Season">
                {["Spring", "Summer", "Autumn", "Winter"].map((s) => <option key={s}>{s}</option>)}
              </Select>
              <Select value={service} onChange={(e) => setService(e.target.value)} aria-label="Service">
                {["Lawn care", "Hedge care", "Leaf clearing", "Pressure washing", "Snow clearing", "Robot rental"].map((s) => <option key={s}>{s}</option>)}
              </Select>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-forest p-5 text-white">
              <div>
                <p className="text-sm text-white/70">Estimated visit price</p>
                <p className="text-4xl font-black">{eur(estimate.total)}</p>
              </div>
              <Link href="/pricing" className="rounded-full bg-lime px-5 py-3 text-sm font-black text-forest">Open full pricing calculator</Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function SeasonalServices() {
  return (
    <Section className="bg-cream">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Seasonal Care</Eyebrow>
            <h2 className="text-4xl font-black text-forest">Four seasons, one tidy garden.</h2>
          </div>
          <ButtonLink href="/services">View all services</ButtonLink>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {seasons.map((season) => {
            const Icon = season.icon;
            return (
              <MotionCard key={season.name}>
                <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl ${season.accent}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-forest">{season.name}</h3>
                <p className="mt-2 min-h-20 text-sm leading-6 text-charcoal/70">{season.summary}</p>
                <ul className="mt-4 grid gap-2">
                  {season.services.map((item) => <li key={item} className="flex gap-2 text-sm font-bold text-charcoal/80"><CheckCircle2 className="h-4 w-4 text-fresh" />{item}</li>)}
                </ul>
                <div className="mt-5 flex items-center justify-between">
                  <strong className="text-forest">{season.price}</strong>
                  <Link href="/pricing" className="rounded-full bg-cream px-4 py-2 text-sm font-black text-forest">Add to estimate</Link>
                </div>
              </MotionCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

function RobotTeaser() {
  return (
    <Section className="bg-white">
      <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-[36px] bg-robot bg-cover bg-center p-8 text-white shadow-premium">
          <div className="min-h-[420px]" />
        </div>
        <div>
          <Eyebrow>Robot Mower Rental</Eyebrow>
          <h2 className="text-4xl font-black text-forest">Rent the perfect lawn instead of buying the machine.</h2>
          <p className="mt-4 text-charcoal/70">Use a robot mower for the mowing season with lower upfront cost, optional setup, and practical maintenance checks.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["No storage problem", "Lower upfront cost", "Regular mowing", "Optional setup", "Optional maintenance check"].map((item) => (
              <div key={item} className="rounded-2xl bg-cream p-4 font-bold text-forest">{item}</div>
            ))}
          </div>
          <div className="mt-7"><ButtonLink href="/robot-mower-rental">View robot mower rental</ButtonLink></div>
        </div>
      </Container>
    </Section>
  );
}

function BundlesPreview() {
  return (
    <Section className="bg-cream">
      <Container>
        <Eyebrow>Seasonal bundles</Eyebrow>
        <h2 className="text-4xl font-black text-forest">Popular care plans.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {bundles.slice(0, 3).map((bundle) => (
            <MotionCard key={bundle.name}>
              <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-forest">Savings {bundle.savings}</span>
              <h3 className="mt-5 text-2xl font-black text-forest">{bundle.name}</h3>
              <p className="mt-2 text-sm text-charcoal/70">{bundle.bestFor}</p>
              <ul className="mt-4 grid gap-2 text-sm font-bold text-charcoal/80">{bundle.includes.map((i) => <li key={i}>• {i}</li>)}</ul>
              <p className="mt-5 text-2xl font-black text-forest">{bundle.price}</p>
            </MotionCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function BeforeAfter() {
  return (
    <Section className="bg-white">
      <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Before / After</Eyebrow>
          <h2 className="text-4xl font-black text-forest">Pressure washing that actually looks finished.</h2>
          <p className="mt-4 text-charcoal/70">A simple visual placeholder for terrace, path, and driveway results.</p>
        </div>
        <div className="grid overflow-hidden rounded-[34px] shadow-premium sm:grid-cols-2">
          <div className="min-h-72 bg-[linear-gradient(rgba(31,41,51,.25),rgba(31,41,51,.25)),url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center p-5 text-white font-black">Before</div>
          <div className="min-h-72 bg-[linear-gradient(rgba(18,61,42,.12),rgba(18,61,42,.12)),url('https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center p-5 text-white font-black">After</div>
        </div>
      </Container>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section className="bg-cream">
      <Container>
        <Eyebrow>Client notes</Eyebrow>
        <h2 className="text-4xl font-black text-forest">Trusted by local homes and landlords.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map(([name, place, quote]) => (
            <MotionCard key={name}>
              <div className="mb-4 flex gap-1 text-lime">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}</div>
              <p className="text-charcoal/75">&quot;{quote}&quot;</p>
              <p className="mt-5 font-black text-forest">{name}</p>
              <p className="text-sm text-charcoal/60">{place}</p>
            </MotionCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
