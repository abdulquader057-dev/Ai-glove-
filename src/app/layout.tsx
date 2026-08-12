import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Glove — Turn gestures into words with AI",
  description: "AI-powered wearable glove that detects hand gestures in real time and converts them into text and speech. Open source hardware for accessibility.",
  openGraph: {
    title: "AI Glove",
    description: "Turn gestures into words with AI",
    images: ["/og-image.jpg"],
    type: "website",
    url: "https://ai-glove.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Glove",
    description: "AI-powered wearable glove that detects hand gestures in real time and converts them into text and speech.",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://ai-glove.vercel.app/" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "AI Glove",
              "description": "AI-powered wearable glove for gesture recognition",
              "brand": {
                "@type": "Brand",
                "name": "AI Glove"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-bg-primary text-text-primary`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
