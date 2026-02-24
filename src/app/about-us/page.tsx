import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir";

export const metadata: Metadata = {
  title: "درباره ما | زیمنس پلاس | اتوماسیون و قطعات صنعتی",
  description:
    "شرکت Siemens Plus با ترکیب دقت مهندسی و طراحی لوکس صنعتی، در زمینه فروش و تعمیرات تخصصی قطعات زیمنس، سیستم‌های کنترل، درایوها و انکودرها فعالیت می‌کند.",
  keywords: [
    "درباره زیمنس پلاس",
    "تیم فنی زیمنس",
    "تعمیرات تخصصی زیمنس",
    "فروش قطعات صنعتی",
    "اتوماسیون صنعتی",
  ],
  openGraph: {
    title: "درباره ما | زیمنس پلاس",
    description:
      "شرکت Siemens Plus با دقت مهندسی و طراحی لوکس صنعتی، فروش و تعمیرات تخصصی قطعات زیمنس.",
    type: "website",
    locale: "fa_IR",
    siteName: "زیمنس پلاس",
    url: `${baseUrl}/about-us`,
    images: [
      {
        url: `${baseUrl}/images/logo.jpg`,
        width: 1200,
        height: 630,
        alt: "زیمنس پلاس - درباره ما",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره ما | زیمنس پلاس",
    description: "شرکت Siemens Plus، فروش و تعمیرات تخصصی قطعات زیمنس.",
  },
  alternates: {
    canonical: "/about-us",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
