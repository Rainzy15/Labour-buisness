import Link from "next/link";
import { BundleQuiz } from "@/components/BundleQuiz";
import { bundles } from "@/lib/data";
import { Container, Eyebrow, MotionCard, Section } from "@/components/ui";

export default function BundlesPage() {
  return (
    <Section className="bg-cream">
      <Container>
        <div className="mb-10 max-w-3xl">
          <Eyebrow>Seasonal planning</Eyebrow>
          <h1 className="text-4xl font-black text-forest sm:text-5xl">Seasonal Care Bundles</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/70">Clear plans for lawns, leaves, winter safety, hedge care, and monthly garden maintenance.</p>
        </div>
        <BundleQuiz />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <MotionCard key={bundle.name}>
              <span className="rounded-full bg-lime px-3 py-1 text-xs font-black text-forest">Savings {bundle.savings}</span>
              <h2 className="mt-5 text-2xl font-black text-forest">{bundle.name}</h2>
              <p className="mt-2 text-sm text-charcoal/70">Best for: {bundle.bestFor}</p>
              <ul className="mt-4 grid gap-2 text-sm font-bold text-charcoal/80">{bundle.includes.map((i) => <li key={i}>• {i}</li>)}</ul>
              <p className="mt-4 text-sm font-bold text-charcoal/60">Frequency: {bundle.frequency}</p>
              <p className="mt-4 text-3xl font-black text-forest">{bundle.price}</p>
              <Link href="/contact" className="mt-5 inline-block rounded-full bg-forest px-5 py-3 text-sm font-black text-white">Request bundle</Link>
            </MotionCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
