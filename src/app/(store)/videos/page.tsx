import type { Metadata } from "next";
import VideosListClient from "./VideosListClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir";

export const metadata: Metadata = {
  title: "ویدیوها | زیمنس پلاس",
  description:
    "مجموعه ویدیوهای آموزشی و معرفی محصولات اتوماسیون صنعتی و تجهیزات زیمنس.",
  openGraph: {
    title: "ویدیوها | زیمنس پلاس",
    description: "ویدیوهای آموزشی و معرفی محصولات صنعتی زیمنس",
    url: `${siteUrl}/videos`,
    locale: "fa_IR",
  },
  alternates: { canonical: "/videos" },
  robots: { index: true, follow: true },
};

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-gray-50/70">
      <VideosListClient />
    </main>
  );
}
