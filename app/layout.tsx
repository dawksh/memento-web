import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Provider";
import Navbar from "@/components/Shared/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner"
import { PostHogProvider } from "@/app/providers/PostHogProvider";

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
  openGraph: {
    images: [
      {
        url: "https://app.momnt.fun/momnt-banner.png",
        width: 1200,
        height: 630,
        alt: "momnt banner"
      }
    ]
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PostHogProvider>
          <Providers>
            <Navbar />
            {children}
            <Toaster />
          </Providers>
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}