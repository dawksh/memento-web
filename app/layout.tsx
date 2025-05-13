import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Provider";
import Navbar from "@/components/Shared/Navbar";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "momnt",
  description: "capture momnts, earn rewards",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://app.momnt.fun/momnt-banner.png",
      button: {
        title: `capture momnt`,
        action: {
          type: "launch_frame",
          name: "momnt",
          url: "https://app.momnt.fun",
          splashImageUrl: "https://app.momnt.fun/momnt.png",
          splashBackgroundColor: `#000000`,
        },
      },
    }),
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script defer src="https://umami-production-6fa2.up.railway.app/script.js" data-website-id="2c78eb34-77c2-4f35-861b-d2b889ad83b1" />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
