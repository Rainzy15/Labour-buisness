import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingCta } from "@/components/FloatingCta";
import { PwaRegister } from "@/components/PwaRegister";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LanguageProvider } from "@/components/language/LanguageProvider";

export const metadata: Metadata = {
  title: "LuxLawn Care | Lawn Mowing & Garden Services Luxembourg",
  description:
    "Transparent lawn mowing, hedge care, pressure washing, winter salting, and seasonal garden maintenance in Luxembourg.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "LuxLawn Admin",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: "/pwa-icon.svg",
    apple: "/pwa-icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#123D2A"
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
            <PwaRegister />
            <Analytics />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
