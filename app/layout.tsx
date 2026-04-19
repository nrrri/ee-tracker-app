import MobileGate from "@/components/MobileGate";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/react'


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
          {children}
          <Analytics />
        </MobileGate>
      </body>
    </html>
  );
}
