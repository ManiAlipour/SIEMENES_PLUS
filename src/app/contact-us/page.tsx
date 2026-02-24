import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir";

export const metadata: Metadata = {
  title: "تماس با ما | زیمنس پلاس | اتوماسیون و قطعات صنعتی",
  description:
    "تماس با تیم فنی زیمنس پلاس: تلفن 09199883772، آدرس قزوین شهر صنعتی البرز. پشتیبانی و مشاوره تخصصی تجهیزات اتوماسیون صنعتی.",
  keywords: [
    "تماس زیمنس پلاس",
    "پشتیبانی فنی زیمنس",
    "آدرس زیمنس پلاس",
    "قزوین شهر صنعتی البرز",
  ],
  openGraph: {
    title: "تماس با ما | زیمنس پلاس",
    description: "تماس با تیم فنی زیمنس پلاس برای مشاوره و پشتیبانی.",
    type: "website",
    locale: "fa_IR",
    siteName: "زیمنس پلاس",
    url: `${baseUrl}/contact-us`,
    images: [
      { url: `${baseUrl}/images/logo.jpg`, width: 1200, height: 630, alt: "زیمنس پلاس - تماس با ما" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تماس با ما | زیمنس پلاس",
    description: "تماس با تیم فنی زیمنس پلاس.",
  },
  alternates: {
    canonical: "/contact-us",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
