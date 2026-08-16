import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { fetchRelatedBlogPosts } from "@/lib/blog/relatedPosts";
import { buildArticleJsonLd } from "@/lib/seo/jsonld";
import { SITE_URL } from "@/lib/seo/site";
import BlogPostClient from "./BlogPostClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = (await BlogPost.findOne({
    slug: slug.toLowerCase(),
    status: "published",
  }).lean()) as any;

  if (!post) return { title: "مطلب یافت نشد" };

  const title = (post.title as string) || "مطلب وبلاگ";
  const description =
    (post.excerpt as string)?.slice(0, 160) || (post.title as string);
  const image = (post.coverImage as string) || `${SITE_URL}/images/logo.jpg`;
  const url = `${SITE_URL}/blog/${slug}`;
  const rawTags = (post as any).tags;
  const tags = Array.isArray(rawTags)
    ? rawTags.filter((t: any) => typeof t === "string" && t.trim())
    : [];

  const keywords: string[] = [
    "وبلاگ صنعتی",
    ...(tags as string[]),
    String(post.title || "").slice(0, 60),
  ].filter(Boolean);

  return {
    title: `${title} | وبلاگ`,
    description,
    keywords,
    authors: [{ name: "مرتضی مجیدی", url: "/about-us/morteza-majidi" }],
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
    twitter: {
      card: "summary_large_image",
      title: `${title} | وبلاگ`,
      description,
    },
    alternates: { canonical: `/blog/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const post = (await BlogPost.findOne({
    slug: slug.toLowerCase(),
    status: "published",
  }).lean()) as any;

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

  const postId = (post as any)._id?.toString();
  const relatedPosts = await fetchRelatedBlogPosts(postId, tags, 3);

  const data = {
    _id: postId,
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

  const jsonLd = buildArticleJsonLd({
    title: post.title,
    description: (post.excerpt as string) || post.title,
    image: (post.coverImage as string) || `${SITE_URL}/images/logo.jpg`,
    slug,
    datePublished: (post as any).createdAt,
    dateModified: (post as any).updatedAt || (post as any).createdAt,
    keywords: tags,
    articleSection: tags[0],
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={data} relatedPosts={relatedPosts} />
    </main>
  );
}
