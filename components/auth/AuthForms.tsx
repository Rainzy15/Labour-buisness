"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, Chrome, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLanguage } from "@/components/language/LanguageProvider";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("Enter a valid email."),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm your password."),
    acceptedTerms: z.boolean().refine(Boolean, "Please accept the terms to create an account.")
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
  });

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export function LoginForm() {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = hasSupabaseEnv();
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

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
      setMessage(error.message.includes("Email not confirmed") ? "Please verify your email before logging in. Check your inbox and spam folder." : error.message);
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

  async function resetPassword() {
    const email = form.getValues("email");
    if (!configured) {
      setMessage("Supabase is not connected yet. Add your keys to .env.local first.");
      return;
    }
    if (!email) {
      setMessage("Enter your email first, then request a password reset.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/dashboard/settings` });
    setMessage(error ? error.message : "Password reset email sent. Check your inbox and spam folder.");
  }

  return (
    <AuthShell title={t("auth.loginTitle")} subtitle={t("auth.loginSubtitle")}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <AuthInput label={t("auth.email")} type="email" registration={form.register("email")} error={form.formState.errors.email?.message} />
        <AuthInput label={t("auth.password")} type="password" registration={form.register("password")} error={form.formState.errors.password?.message} />
        <button disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} {t("auth.loginButton")}
        </button>
      </form>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button onClick={resetPassword} className="text-left text-sm font-black text-forest underline-offset-4 hover:underline">
          {t("auth.forgot")}
        </button>
        <Link href="/signup" className="text-sm font-black text-forest underline-offset-4 hover:underline">
          {t("auth.create")}
        </Link>
      </div>
      <div className="mt-4 grid gap-2">
        <button onClick={sendMagicLink} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-sm font-black text-forest">
          <Mail className="h-4 w-4" /> {t("auth.magic")}
        </button>
        <OAuthButtons />
      </div>
      {message && <p className="mt-4 rounded-2xl bg-cream p-3 text-sm font-bold text-forest">{message}</p>}
    </AuthShell>
  );
}

export function SignupForm() {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const configured = hasSupabaseEnv();
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", firstName: "", lastName: "", phone: "", acceptedTerms: false }
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
          phone: values.phone
        }
      }
    });
    await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setCreated(true);
  }

  if (created) {
    return (
      <AuthShell title={t("auth.verifyTitle")} subtitle={t("auth.verifyBody")}>
        <p className="rounded-3xl bg-cream p-4 text-sm font-bold leading-6 text-forest">{t("auth.verifySpam")}</p>
        <Link href="/login" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-black text-white">
          {t("auth.backLogin")}
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t("auth.signupTitle")} subtitle={t("auth.signupSubtitle")}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput label={t("auth.firstName")} registration={form.register("firstName")} error={form.formState.errors.firstName?.message} />
          <AuthInput label={t("auth.lastName")} registration={form.register("lastName")} error={form.formState.errors.lastName?.message} />
        </div>
        <AuthInput label={t("auth.email")} type="email" registration={form.register("email")} error={form.formState.errors.email?.message} />
        <AuthInput label={t("auth.phone")} type="tel" registration={form.register("phone")} error={form.formState.errors.phone?.message} />
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthInput label={t("auth.password")} type="password" registration={form.register("password")} error={form.formState.errors.password?.message} />
          <AuthInput label={t("auth.confirmPassword")} type="password" registration={form.register("confirmPassword")} error={form.formState.errors.confirmPassword?.message} />
        </div>
        <label className="flex gap-3 rounded-2xl bg-cream p-4 text-sm font-bold leading-6 text-forest">
          <input type="checkbox" className="mt-1" {...form.register("acceptedTerms")} /> {t("auth.terms")}
        </label>
        {form.formState.errors.acceptedTerms?.message && <span className="text-xs font-bold text-red-700">{form.formState.errors.acceptedTerms.message}</span>}
        <button disabled={loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-black text-white disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} {t("auth.signupButton")}
        </button>
      </form>
      <div className="mt-4"><OAuthButtons /></div>
      {message && <p className="mt-4 rounded-2xl bg-cream p-3 text-sm font-bold text-forest">{message}</p>}
    </AuthShell>
  );
}

function OAuthButtons() {
  const { t } = useLanguage();

  async function signIn(provider: "google" | "apple") {
    if (!hasSupabaseEnv()) return;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard`, queryParams: { prompt: "select_account" } }
    });
    if (error) console.error(`${provider} sign-in failed`, error.message);
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <button onClick={() => signIn("google")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-sm font-black text-forest">
        <Chrome className="h-4 w-4" /> {t("auth.google")}
      </button>
      <button onClick={() => signIn("apple")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-sm font-black text-forest">
        <Apple className="h-4 w-4" /> {t("auth.apple")}
      </button>
    </div>
  );
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] bg-white p-5 shadow-premium sm:rounded-[34px] sm:p-6">
      <h1 className="text-3xl font-black text-forest sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-charcoal/70">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function AuthInput({ label, registration, error, type = "text" }: { label: string; registration: any; error?: string; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-forest">
      {label}
      <input type={type} {...registration} className="min-h-11 rounded-2xl border border-forest/15 bg-cream px-4 py-3 text-base outline-none focus:ring-4 focus:ring-lime/40 sm:text-sm" />
      {error && <span className="text-xs font-bold text-red-700">{error}</span>}
    </label>
  );
}
