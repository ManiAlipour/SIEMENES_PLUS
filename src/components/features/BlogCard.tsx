import Link from "next/link";
import AparatPlayer from "./AparatPlayer";

export interface BlogCardModel {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string;
  coverImage?: string;
  video?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: string;
}

export default function BlogCard({ post }: { post: BlogCardModel }) {
  const { title, slug, excerpt, coverImage, video, tags, status, createdAt } = post;

  if (status === "draft") return null;

  const href = slug ? `/blog/${slug}` : null;

  const content = (
    <>
      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
        {video ? (
          <div className="absolute inset-0">
            <AparatPlayer videoUrl={video} />
          </div>
        ) : coverImage ? (
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-200 text-slate-500 text-sm">
            بدون تصویر
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
      <div className="flex-1 p-4 md:p-5 flex flex-col gap-2">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors line-clamp-2" dir="auto">
          {title}
        </h2>
        {excerpt && (
          <p className="text-slate-600 text-sm line-clamp-2" dir="auto">{excerpt}</p>
        )}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
            {tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <time
          dateTime={new Date(createdAt).toISOString()}
          className="text-xs text-slate-400 mt-auto pt-1"
        >
          {new Date(createdAt).toLocaleDateString("fa-IR")}
        </time>
      </div>
    </>
  );

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:border-cyan-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus-within:shadow-lg"
      aria-label={`مطلب: ${title}`}
    >
      {href ? (
        <Link
          href={href}
          className="flex flex-col flex-1 min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 rounded-2xl"
        >
          {content}
        </Link>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">{content}</div>
      )}
    </article>
  );
}
