import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SIGNOVA — Turning Gestures Into a Voice | Team Syntropy",
  description: "Web application for a 3-finger gesture-to-voice glove powered by Seeed XIAO nRF52840 Sense / Arduino Uno over USB Serial.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#08090A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono bg-[#08090A] text-white min-h-screen antialiased selection:bg-[#2EE6A6] selection:text-[#08090A]`}
      >
        {children}
      </body>
    </html>
  );
}
