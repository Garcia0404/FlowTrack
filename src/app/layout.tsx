import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowTrack — Workflows visuales",
  description:
    "Gestiona flujos de trabajo paso a paso con una experiencia premium y minimalista.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
