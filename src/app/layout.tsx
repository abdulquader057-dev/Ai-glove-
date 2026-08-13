import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-glove.vercel.app'),
  title: "Sensasign AI — Wearable Intelligence. Gesture to Voice.",
  description: "Sensasign AI detects hand gestures in real-time via hardware flex sensors & IMU on XIAO nRF52840, translating gestures to instant voice output.",
  openGraph: {
    title: "Sensasign AI",
    description: "Wearable Intelligence. Gesture to Voice.",
    images: ["/og-image.jpg"],
    type: "website",
    url: "https://ai-glove.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sensasign AI",
    description: "Wearable Intelligence. Gesture to Voice.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  }
};

export const viewport = {
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} font-inter bg-[#030712] text-white min-h-screen antialiased selection:bg-[#00f0ff] selection:text-[#030712]`}>
        {children}
      </body>
    </html>
  );
}
