import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Giftways - Transform Giveaways into Real Money Opportunities",
  description:
    "Create monetized giveaway campaigns or participate in exciting giveaways to win real money prizes. Complete simple social media tasks like following, sharing, and engaging with content to earn cash rewards. Join 10,000+ creators and participants worldwide who have distributed ₦2.5M+ in prizes. Start earning today!",

  openGraph: {
    title: "Giftways - Transform Giveaways into Real Money Opportunities",
    description:
      "Create monetized giveaway campaigns or participate in exciting giveaways to win real money prizes. Complete simple social media tasks like following, sharing, and engaging with content to earn cash rewards. Join 10,000+ creators and participants worldwide who have distributed ₦2.5M+ in prizes. Start earning today!",
    url: "https://giftways.vercel.app/",
    siteName: "Giftways",
    images: [
      {
        url: "https://res.cloudinary.com/dkfmaqtpy/image/upload/v1752097536/giftways_s7laba.jpg",
        width: 1200,
        height: 630,
        alt: "Giftways - Monetized Giveaway Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giftways - Transform Giveaways into Real Money Opportunities",
    description:
      "Create monetized giveaway campaigns or participate in exciting giveaways to win real money prizes. Complete simple social media tasks and earn cash rewards.",
    images: [
      "https://res.cloudinary.com/dkfmaqtpy/image/upload/v1752097536/giftways_s7laba.jpg",
    ],
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
