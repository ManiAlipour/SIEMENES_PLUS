import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import Script from "next/script";
import GaRouteTracker from "@/components/providers/GaRouteTracker";
import { Suspense } from "react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale: 1,
  viewportFit: "cover",
};

const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://siemensplus1.ir"),
  title: "زیمنس پلاس | قطعات",
  description:
    "فروش و پشتیبانی تخصصی تجهیزات زیمنس و ارائه راهکارهای مهندسی. PLC، اینورتر، HMI و قطعات .",

  keywords: [
    "زیمنس",
    "فروشگاه زیمنس",
    "محصولات زیمنس",
    "کد محصولات",
    "نام محصولات",
    "PLC",
    "اینورتر",
    "HMI",
    "قطعات صنعتی",
    "زیمنس پلاس",
  ],
  authors: [{ name: "Siemens Plus" }],
  creator: "Siemens Plus",
  publisher: "Siemens Plus",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://siemensplus1.ir",
    siteName: "زیمنس پلاس",
    title: "زیمنس پلاس | قطعات",
    description: "فروش و پشتیبانی تخصصی تجهیزات زیمنس و ارائه راهکارهای مهندسی",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "زیمنس پلاس",
      },
    ],
  },
  icons: {
    icon: [
      {
        url: "./favicon.ico",
        href: "./favicon.ico",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "زیمنس پلاس | قطعات",
    description: "فروش و پشتیبانی تخصصی تجهیزات زیمنس",
    images: ["/images/logo.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="fa-IR">
      <body>
        <Providers>{children}</Providers>
        <Suspense fallback={null}>
          <GaRouteTracker />
        </Suspense>
      </body>
    </html>
  );
}
