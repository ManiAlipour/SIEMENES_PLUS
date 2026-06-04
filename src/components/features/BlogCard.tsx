import Link from "next/link";
import { FiArrowLeft, FiClock } from "react-icons/fi";
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

export default function BlogCard({
  post,
  featured = false,
}: {
  post: BlogCardModel;
  featured?: boolean;
}) {
  const { title, slug, excerpt, coverImage, video, tags, status, createdAt } =
    post;

  if (status === "draft") return null;

  const href = slug ? `/blog/${slug}` : null;
  const dateLabel = new Date(createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cardInner = (
    <>
      <div
        className={`relative w-full overflow-hidden bg-slate-100 ${
          featured ? "aspect-[21/9] sm:aspect-[2.4/1]" : "aspect-[16/10]"
        }`}
      >
        {video && !coverImage ? (
          <div className="absolute inset-0 pointer-events-none">
            <AparatPlayer videoUrl={video} />
          </div>
        ) : coverImage ? (
          <img
            src={coverImage}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 66vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />
        ) : (
          <div className="flex h-full min-h-[140px] items-center justify-center bg-gradient-to-br from-slate-100 to-cyan-50 text-slate-400 text-sm">
            بدون تصویر
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-80" />
        {featured && (
          <span className="absolute top-4 right-4 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            پیشنهادی
          </span>
        )}
      </div>
      <div
        className={`flex flex-1 flex-col gap-2 ${featured ? "p-5 sm:p-6" : "p-4 sm:p-5"}`}
      >
        <time
          dateTime={new Date(createdAt).toISOString()}
          className="inline-flex items-center gap-1 text-xs font-medium text-cyan-600"
        >
          <FiClock size={12} />
          {dateLabel}
        </time>
        <h2
          className={`font-bold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2 ${
            featured ? "text-xl sm:text-2xl" : "text-lg"
          }`}
          dir="auto"
        >
          {title}
        </h2>
        {excerpt && (
          <p
            className={`text-slate-600 line-clamp-2 leading-relaxed ${
              featured ? "text-sm sm:text-base" : "text-sm"
            }`}
            dir="auto"
          >
            {excerpt}
          </p>
        )}
        {Array.isArray(tags) && tags.length > 0 && (
          <div
            className="flex flex-wrap gap-1.5 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100 hover:bg-cyan-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {href && (
          <span className="mt-auto pt-2 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 group-hover:gap-2 transition-all">
            ادامه مطلب
            <FiArrowLeft size={14} />
          </span>
        )}
      </div>
    </>
  );

  const articleClass = featured
    ? "group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md hover:shadow-xl hover:border-cyan-200/80 transition-all duration-300 sm:col-span-2 lg:col-span-3"
    : "group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-lg hover:border-cyan-200/80 hover:-translate-y-0.5 transition-all duration-300";

  return (
    <article className={articleClass} aria-label={`مطلب: ${title}`}>
      {href ? (
        <Link
          href={href}
          className="flex flex-col flex-1 min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 rounded-2xl"
        >
          {cardInner}
        </Link>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">{cardInner}</div>
      )}
    </article>
  );
}
