import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingCta } from "@/components/FloatingCta";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/components/language/LanguageProvider";

export const metadata: Metadata = {
  title: "LuxLawn Care | Lawn Mowing & Garden Services Luxembourg",
  description:
    "Transparent lawn mowing, hedge care, pressure washing, winter salting, and robot mower rental in Luxembourg."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <Header />
            <main>{children}</main>
            <FloatingCta />
            <Footer />
            <Analytics />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
