"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import BlogPostContent from "@/components/blog/BlogPostContent";

const AparatPlayer = dynamic(
  () => import("@/components/features/AparatPlayer"),
  { ssr: false },
);

interface EmbeddedProduct {
  productId: string;
  slug: string;
  blockId: string;
}

interface Post {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  video?: string;
  tags?: string[];
  embeddedProducts?: EmbeddedProduct[];
  createdAt: string;
  updatedAt?: string;
}

interface BlogPostClientProps {
  post: Post;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <article className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-10 max-w-3xl">
      {/* Breadcrumb - موبایل فرندلی: truncate و فونت کوچک‌تر */}
      <nav
        className="mb-4 sm:mb-6 text-xs sm:text-sm text-slate-500 overflow-hidden"
        aria-label="مسیر"
      >
        <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 min-w-0">
          <Link href="/" className="hover:text-cyan-600 shrink-0">
            خانه
          </Link>
          <span className="shrink-0">/</span>
          <Link href="/blog" className="hover:text-cyan-600 shrink-0">
            وبلاگ
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-slate-700 truncate min-w-0" title={post.title} dir="auto">
            {post.title}
          </span>
        </div>
      </nav>

      <header className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight" dir="auto">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs sm:text-sm">
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {new Date(post.createdAt).toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {tags.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-700 hover:bg-cyan-200 text-xs"
                >
                  {tag}
                </Link>
              ))}
            </span>
          )}
        </div>
        {post.excerpt && (
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed" dir="auto">
            {post.excerpt}
          </p>
        )}
      </header>

      {(post.coverImage || post.video) && (
        <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-6 sm:mb-8">
          {post.video && (
            <div className="aspect-video w-full">
              <AparatPlayer videoUrl={post.video} />
            </div>
          )}
          {post.coverImage && !post.video && (
            <img
              src={post.coverImage}
              alt=""
              className="w-full aspect-video object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          )}
          {post.coverImage && post.video && (
            <img
              src={post.coverImage}
              alt=""
              className="w-full max-h-48 sm:max-h-64 object-cover object-top"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          )}
        </div>
      )}

      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 overflow-hidden">
        <BlogPostContent
          content={post.content || ""}
          embeddedProducts={post.embeddedProducts || []}
        />
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 sm:py-2.5 rounded-xl border border-cyan-500 text-cyan-600 hover:bg-cyan-50 transition text-sm sm:text-base"
        >
          بازگشت به لیست مطالب
        </Link>
      </div>
    </article>
  );
}
