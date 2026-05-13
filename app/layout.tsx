import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingCta } from "@/components/FloatingCta";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "LuxLawn Care | Lawn Mowing & Garden Services Luxembourg",
  description:
    "Transparent lawn mowing, hedge care, pressure washing, winter salting, and robot mower rental in Luxembourg."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <Header />
        <main>{children}</main>
        <FloatingCta />
        <Footer />
      </body>
    </html>
  );
}
