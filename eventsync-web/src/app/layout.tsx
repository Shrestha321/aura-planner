import type { Metadata } from "next";
import { LocaleProvider } from "@/context/LocaleContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura - Next-Gen AI Event Architecture & Command Center",
  description:
    "Autonomous event planning command center powered by Google Gemini. Precision timeline telemetry, financial pulse tracking, and real-time operational copilot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-cyan-500 selection:text-neutral-950">
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
