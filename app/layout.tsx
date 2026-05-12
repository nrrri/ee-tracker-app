import MobileGate from "@/components/MobileGate";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/react'
import { TriangleAlert } from "lucide-react";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional but recommended
})

export const metadata: Metadata = {
  title: "Express Entry Tracker",
  description: "Express Entry Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={`font-sans text-center`}
      >
        <MobileGate>
          <div className="w-full bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 mb-6 text-sm flex items-start gap-1">
            <TriangleAlert size={18} className="shrink-0" />
            <div>
              <span className="font-semibold">Disclaimer:</span>{" "}
              This dashboard uses data from Immigration, Refugees and Citizenship Canada (IRCC) and is provided for informational purposes only.
              Any analysis, insights, or commentary are independently generated and do not represent official IRCC statements or policy.
              The information may not be fully accurate, complete, or up to date.{" "}
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations.html#latest"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium inline-flex items-center gap-1"
              >
                View official source
              </a>
            </div>
          </div>
          {children}
          <Analytics />
        </MobileGate>
      </body>
    </html>
  );
}
