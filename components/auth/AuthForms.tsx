"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Github, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

const authSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

const signupSchema = authSchema.extend({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  marketingConsent: z.boolean().optional()
});

type LoginValues = z.infer<typeof authSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = hasSupabaseEnv();
  const form = useForm<LoginValues>({ resolver: zodResolver(authSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginValues) {
    if (!configured) {
      setMessage("Supabase is not connected yet. Add your keys to .env.local first.");
      return;
    }

    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function sendMagicLink() {
    const email = form.getValues("email");
    if (!configured) {
      setMessage("Supabase is not connected yet. Add your keys to .env.local first.");
      return;
    }
    if (!email) {
      setMessage("Enter your email first, then request a magic link.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
    setMessage(error ? error.message : "Magic link sent. Check your inbox.");
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage bookings, contracts, invoices, and robot rentals.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <AuthInput label="Email" type="email" registration={form.register("email")} error={form.formState.errors.email?.message} />
        <AuthInput label="Password" type="password" registration={form.register("password")} error={form.formState.errors.password?.message} />
        <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Log in
        </button>
      </form>
      <div className="mt-4 grid gap-2">
        <button onClick={sendMagicLink} className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-sm font-black text-forest">
          <Mail className="h-4 w-4" /> Email magic link
        </button>
        <OAuthButtons />
      </div>
      {message && <p className="mt-4 rounded-2xl bg-cream p-3 text-sm font-bold text-forest">{message}</p>}
    </AuthShell>
  );
}

export function SignupForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = hasSupabaseEnv();
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "", marketingConsent: false }
  });

  async function onSubmit(values: SignupValues) {
    if (!configured) {
      setMessage("Supabase is not connected yet. Add your keys to .env.local first.");
      return;
    }

    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          marketing_consent: values.marketingConsent
        }
      }
    });
    setLoading(false);
    setMessage(error ? error.message : "Account created. Check your email if confirmation is enabled.");
  }

  return (
    <AuthShell title="Create your account" subtitle="Book services, track appointments, manage addresses, and view invoices.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput label="First name" registration={form.register("firstName")} error={form.formState.errors.firstName?.message} />
          <AuthInput label="Last name" registration={form.register("lastName")} error={form.formState.errors.lastName?.message} />
        </div>
        <AuthInput label="Email" type="email" registration={form.register("email")} error={form.formState.errors.email?.message} />
        <AuthInput label="Password" type="password" registration={form.register("password")} error={form.formState.errors.password?.message} />
        <label className="flex gap-3 rounded-2xl bg-cream p-4 text-sm font-bold text-forest">
          <input type="checkbox" {...form.register("marketingConsent")} /> I agree to receive service updates and seasonal reminders.
        </label>
        <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign up
        </button>
      </form>
      <div className="mt-4"><OAuthButtons /></div>
      {message && <p className="mt-4 rounded-2xl bg-cream p-3 text-sm font-bold text-forest">{message}</p>}
    </AuthShell>
  );
}

function OAuthButtons() {
  async function signIn(provider: "google" | "apple") {
    if (!hasSupabaseEnv()) return;
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/dashboard` } });
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <button onClick={() => signIn("google")} className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-sm font-black text-forest">
        <Github className="h-4 w-4" /> Google
      </button>
      <button onClick={() => signIn("apple")} className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-sm font-black text-forest">
        Apple / iCloud
      </button>
    </div>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[34px] bg-white p-6 shadow-premium">
      <h1 className="text-3xl font-black text-forest">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-charcoal/70">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function AuthInput({ label, registration, error, type = "text" }: { label: string; registration: any; error?: string; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <input type={type} {...registration} className="rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-lime/40" />
      {error && <span className="text-xs font-bold text-red-700">{error}</span>}
    </label>
  );
}
