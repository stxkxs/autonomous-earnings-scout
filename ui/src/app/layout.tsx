import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Autonomous Earnings Scout",
  description: "AI-powered tech stock earnings research and analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${instrumentSans.variable} ${jetbrainsMono.variable} ${newsreader.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
