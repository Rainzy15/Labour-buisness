import Link from "next/link";
import { LoginForm } from "@/components/auth/AuthForms";
import { Container, Section } from "@/components/ui";

export default function LoginPage() {
  return (
    <Section className="bg-cream">
      <Container className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-fresh">Account access</p>
          <h1 className="mt-3 text-5xl font-black text-forest">Your garden care portal.</h1>
          <p className="mt-4 text-lg leading-8 text-charcoal/70">Customers can manage bookings, employees can see assigned jobs, and admins can run operations from one place.</p>
          <p className="mt-5 text-sm text-charcoal/70">No account yet? <Link href="/signup" className="font-black text-forest">Create one here.</Link></p>
        </div>
        <LoginForm />
      </Container>
    </Section>
  );
}
