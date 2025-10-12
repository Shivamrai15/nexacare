import type { Metadata } from "next";
import { Catamaran } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth";
import { TRPCReactProvider } from "@/trpc/client";

const font = Catamaran({
    subsets: ["latin"],
    weight: ["100", "200", "300","400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
    title:  "Nexacare | Trusted Health & Home Care Services",
    description:
        "Nexacare connects families and individuals with trusted caregivers, nurses, and healthcare professionals. Find reliable health and home care services tailored to your needs.",
    keywords: [
        "Nexacare",
        "home care services",
        "healthcare provider",
        "caregivers",
        "elderly care",
        "nursing services",
        "personal care",
        "child care",
        "medical assistance",
        "home nurse",
        "professional caregivers",
        "healthcare at home"
    ],
    authors: [{ name: "Nexacare" }],
    creator: "Nexacare Team",
    publisher: "Nexacare",
    metadataBase: new URL("https://www.nexacare.com"),

    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://www.nexacare.com",
        title: "Nexacare | Trusted Health & Home Care Services",
        description:
        "Nexacare helps you find verified caregivers, nurses, and home health professionals for your loved ones. Compassionate care, anytime, anywhere.",
        siteName: "Nexacare",
        images: [
        {
            url: "https://www.nexacare.com/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Nexacare – Health & Home Care Services",
        },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Nexacare | Trusted Health & Home Care Services",
        description:
        "Find qualified caregivers, nurses, and home health aides with Nexacare. Compassionate care made simple.",
        creator: "@nexacare",
        images: ["https://www.nexacare.com/twitter-image.jpg"],
    },

    alternates: {
        canonical: "https://www.nexacare.com",
    },

    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
        },
    },
    category: "Healthcare",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

     const session = await auth();

    return (
        <html lang="en" suppressHydrationWarning>
            <SessionProvider session={session}>
                <TRPCReactProvider>

                    <body
                        className={`${font.className} antialiased relative`}
                    >
                        <Toaster
                            position="top-right"
                            richColors
                        />
                        {/* <ModalProvider /> */}
                        {children}
                    </body>
                </TRPCReactProvider>
            </SessionProvider>
        </html>
    );
}
