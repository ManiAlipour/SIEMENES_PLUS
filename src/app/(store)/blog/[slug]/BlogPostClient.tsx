"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { FiClock, FiTag } from "react-icons/fi";
import BlogPostContent from "@/components/blog/BlogPostContent";
import RelatedPosts, {
  type RelatedPostSummary,
} from "@/components/blog/RelatedPosts";
import CommentsSection from "@/components/features/CommentsSection";

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
  relatedPosts?: RelatedPostSummary[];
}

export default function BlogPostClient({
  post,
  relatedPosts = [],
}: BlogPostClientProps) {
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const readMinutes = Math.max(
    1,
    Math.ceil((post.content?.replace(/<[^>]+>/g, "").length || 0) / 1200),
  );

  return (
    <article className="relative">
      {/* Hero */}
      <div className="border-b border-slate-200/80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
          <nav
            className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-300"
            aria-label="مسیر"
          >
            <Link href="/" className="hover:text-cyan-300 transition-colors">
              خانه
            </Link>
            <span className="text-slate-500">/</span>
            <Link href="/blog" className="hover:text-cyan-300 transition-colors">
              وبلاگ
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-slate-100 truncate max-w-[12rem] sm:max-w-md" title={post.title}>
              {post.title}
            </span>
          </nav>

          <header>
            {tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-200 hover:bg-white/15 transition-colors"
                  >
                    <FiTag size={12} />
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white"
              dir="auto"
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p
                className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl"
                dir="auto"
              >
                {post.excerpt}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <time
                className="inline-flex items-center gap-1.5"
                dateTime={new Date(post.createdAt).toISOString()}
              >
                <FiClock size={14} />
                {new Date(post.createdAt).toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-slate-500">·</span>
              <span>حدود {readMinutes} دقیقه مطالعه</span>
            </div>
          </header>
        </div>
      </div>

      {/* Cover / video */}
      {(post.coverImage || post.video) && (
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10">
          <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10">
            {post.video ? (
              <div className="aspect-video w-full bg-black">
                <AparatPlayer videoUrl={post.video} />
              </div>
            ) : post.coverImage ? (
              <img
                src={post.coverImage}
                alt=""
                className="w-full aspect-[2/1] object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            ) : null}
            {post.coverImage && post.video && (
              <img
                src={post.coverImage}
                alt=""
                className="w-full max-h-40 object-cover object-center border-t border-slate-100"
              />
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="blog-article-shell p-5 sm:p-8 md:p-10">
          <BlogPostContent
            content={post.content || ""}
            embeddedProducts={post.embeddedProducts || []}
          />
        </div>

        <RelatedPosts posts={relatedPosts} />

        <CommentsSection
          targetType="blogPost"
          targetId={post._id}
          title="نظرات این مطلب"
        />

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/blog"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 border-cyan-500 px-6 py-3 text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition-colors w-full sm:w-auto"
          >
            بازگشت به لیست مطالب
          </Link>
        </div>
      </div>
    </article>
  );
}
