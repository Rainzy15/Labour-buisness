import Link from "next/link";
import { SignupForm } from "@/components/auth/AuthForms";
import { Container, Section } from "@/components/ui";

export default function SignupPage() {
  return (
    <Section className="bg-cream">
      <Container className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-fresh">Create account</p>
          <h1 className="mt-3 text-4xl font-black text-forest sm:text-5xl">Book and track LuxLawn Care services.</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/70">Create a customer account to request quotes, manage addresses, view contracts, and follow service history.</p>
          <p className="mt-5 text-sm text-charcoal/70">Already have an account? <Link href="/login" className="font-black text-forest">Log in here.</Link></p>
        </div>
        <SignupForm />
      </Container>
    </Section>
  );
}
