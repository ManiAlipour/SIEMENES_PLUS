import type { Metadata } from "next";
import { Suspense } from "react";
import BlogListClient from "./BlogListClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir";

export const metadata: Metadata = {
  title: "وبلاگ | مقالات و اخبار صنعتی",
  description:
    "مقالات تخصصی اتوماسیون صنعتی، PLC، اینورتر، HMI و تجهیزات زیمنس. اخبار و راهنماهای فنی.",
  keywords: [
    "وبلاگ صنعتی",
    "اتوماسیون صنعتی",
    "PLC",
    "اینورتر",
    "HMI",
    "زیمنس",
    "مقالات فنی",
  ],
  openGraph: {
    title: "وبلاگ | مقالات و اخبار صنعتی",
    description: "مقالات تخصصی اتوماسیون صنعتی و تجهیزات زیمنس",
    type: "website",
    locale: "fa_IR",
    siteName: "زیمنس پلاس",
    url: `${siteUrl}/blog`,
    images: [{ url: `${siteUrl}/images/logo.jpg`, width: 1200, height: 630, alt: "وبلاگ زیمنس پلاس" }],
  },
  alternates: { canonical: "/blog" },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50/70">
      <Suspense fallback={<div className="container mx-auto px-4 py-12">در حال بارگذاری مطالب...</div>}>
        <BlogListClient />
      </Suspense>
    </main>
  );
}
