import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import BlogPostClient from "./BlogPostClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://site-mohandesi.ir";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({
    slug: slug.toLowerCase(),
    status: "published",
  }).lean();

  if (!post) return { title: "مطلب یافت نشد" };

  const title = (post.title as string) || "مطلب وبلاگ";
  const description =
    (post.excerpt as string)?.slice(0, 160) || (post.title as string);
  const image = (post.coverImage as string) || `${siteUrl}/images/logo.jpg`;
  const url = `${siteUrl}/blog/${slug}`;
  const rawTags = (post as any).tags;
  const tags = Array.isArray(rawTags)
    ? rawTags.filter((t: any) => typeof t === "string" && t.trim())
    : [];

  const keywords: string[] = [
    "وبلاگ صنعتی",
    "اتوماسیون صنعتی",
    ...(tags as string[]),
    String(post.title || "").slice(0, 60),
  ].filter(Boolean);

  return {
    title: `${title} | وبلاگ`,
    description,
    keywords,
    openGraph: {
      title: `${title} | وبلاگ`,
      description,
      type: "article",
      locale: "fa_IR",
      url,
      siteName: "زیمنس پلاس",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      publishedTime: (post as any).createdAt,
      modifiedTime: (post as any).updatedAt || (post as any).createdAt,
    },
    twitter: { card: "summary_large_image", title: `${title} | وبلاگ`, description },
    alternates: { canonical: `/blog/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const post = await BlogPost.findOne({
    slug: slug.toLowerCase(),
    status: "published",
  }).lean();

  if (!post) notFound();

  const rawEmbedded = (post as any).embeddedProducts || [];
  const embeddedProducts = rawEmbedded.map((p: any) => ({
    productId: p?.productId?.toString?.() ?? String(p?.productId ?? ""),
    slug: typeof p?.slug === "string" ? p.slug : "",
    blockId: typeof p?.blockId === "string" ? p.blockId : "",
  }));

  const rawTags = (post as any).tags;
  const tags = Array.isArray(rawTags)
    ? rawTags.filter((t: any) => typeof t === "string" && t.trim())
    : [];

  const data = {
    _id: (post as any)._id?.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    video: post.video,
    embeddedProducts,
    tags,
    createdAt: (post as any).createdAt,
    updatedAt: (post as any).updatedAt,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: (post.excerpt as string) || post.title,
    image: (post.coverImage as string) || `${siteUrl}/images/logo.jpg`,
    datePublished: (post as any).createdAt,
    dateModified: (post as any).updatedAt || (post as any).createdAt,
    author: { "@type": "Organization", name: "زیمنس پلاس" },
    publisher: {
      "@type": "Organization",
      name: "زیمنس پلاس",
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.jpg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${slug}` },
    keywords: tags,
    articleSection: tags[0] || undefined,
    about: tags.map((t: string) => ({ "@type": "Thing", name: t })),
  };

  return (
    <main className="min-h-screen bg-gray-50/70">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={data} />
    </main>
  );
}
