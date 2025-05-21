import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: { address: string } }) {
    const { address } = params;
    return {
        title: "momnt",
        description: "capture momnts, earn rewards",
        openGraph: {
            title: "momnt",
            description: "capture momnts, earn rewards",
            images: [`/api/og?coin=${address}`],
        },
        other: {
            "fc:frame": JSON.stringify({
                version: "next",
                imageUrl: `https://app.momnt.fun/api/og?coin=${address}`,
                button: {
                    title: `ape moment`,
                    action: {
                        type: "launch_frame",
                        name: "ape moment",
                        url: `https://app.momnt.fun/moment/${address}`,
                        splashImageUrl: "https://app.momnt.fun/momnt.png",
                        splashBackgroundColor: `#000000`,
                    },
                },
            }),
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}