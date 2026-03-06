import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ship Charter — Profitability Calculator",
  description: "Shipping Logistics Profitability Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
