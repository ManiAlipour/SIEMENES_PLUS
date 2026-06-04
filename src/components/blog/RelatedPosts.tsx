import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export interface RelatedPostSummary {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string;
  coverImage?: string;
  createdAt: string;
}

export default function RelatedPosts({ posts }: { posts: RelatedPostSummary[] }) {
  if (!posts.length) return null;

  return (
    <aside className="mt-12 sm:mt-16" aria-labelledby="related-posts-heading">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2
          id="related-posts-heading"
          className="text-lg sm:text-xl font-bold text-slate-900"
        >
          مطالب مرتبط
        </h2>
        <Link
          href="/blog"
          className="text-sm text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 shrink-0"
        >
          همه مطالب
          <FiArrowLeft size={14} />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const href = post.slug ? `/blog/${post.slug}` : null;
          const date = new Date(post.createdAt).toLocaleDateString("fa-IR", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const card = (
            <>
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                    بدون تصویر
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <time className="text-xs text-cyan-600 font-medium">{date}</time>
                <h3
                  className="font-bold text-slate-800 line-clamp-2 group-hover:text-cyan-700 transition-colors"
                  dir="auto"
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-slate-500 line-clamp-2" dir="auto">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </>
          );

          return href ? (
            <Link
              key={post._id}
              href={href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-cyan-200 hover:shadow-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {card}
            </Link>
          ) : (
            <article
              key={post._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              {card}
            </article>
          );
        })}
      </div>
    </aside>
  );
}
