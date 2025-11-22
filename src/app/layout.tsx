import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://site-mohandesi.ir"),
  title: "زیمنس پلاس | اتوماسیون و قطعات صنعتی",
  description:
    "فروش و پشتیبانی تخصصی تجهیزات اتوماسیون صنعتی زیمنس و ارائه راهکارهای مهندسی. PLC، اینورتر، HMI و قطعات صنعتی.",
  keywords: [
    "زیمنس",
    "PLC",
    "اتوماسیون صنعتی",
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
    url: "https://site-mohandesi.ir",
    siteName: "زیمنس پلاس",
    title: "زیمنس پلاس | اتوماسیون و قطعات صنعتی",
    description:
      "فروش و پشتیبانی تخصصی تجهیزات اتوماسیون صنعتی زیمنس و ارائه راهکارهای مهندسی",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "زیمنس پلاس",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "زیمنس پلاس | اتوماسیون و قطعات صنعتی",
    description: "فروش و پشتیبانی تخصصی تجهیزات اتوماسیون صنعتی زیمنس",
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

// ✅ Viewport باید جداگانه export بشه
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
      </body>
    </html>
  );
}
