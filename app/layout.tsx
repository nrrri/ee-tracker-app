import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"


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
        {children}
      </body>
    </html>
  );
}
