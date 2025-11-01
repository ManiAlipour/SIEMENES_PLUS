import Head from "next/head";

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image";
  jsonLd?: object;
}

export default function Seo({
  title = "زیمنس پلاس | اتوماسیون و قطعات صنعتی",
  description = "فروش و پشتیبانی تخصصی تجهیزات اتوماسیون صنعتی زیمنس و ارائه راهکارهای مهندسی.",
  canonical,
  ogImage = "/images/logo.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  jsonLd,
}: SeoProps) {
  const fullTitle = title;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
