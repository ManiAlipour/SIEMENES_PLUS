import AparatPlayer from "./AparatPlayer";

export interface PostCardModel {
  _id: string;
  title: string;
  video: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function BlogCard({ post }: { post: PostCardModel }) {
  const { _id, title, video, status, createdAt } = post;

  // Draft posts should not be displayed
  if (status === "draft") {
    return null;
  }

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl border
       border-gray-200 bg-[#f7f9fb] shadow-sm hover:border-primary/80
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300 
        focus-within:shadow-lg"
      aria-label={`مطلب: ${title}`}
    >
      {/* Media (aparat video only in new model) */}
      <div className="relative w-full aspect-video overflow-hidden">
        {video ? (
          <div className="absolute inset-0">
            <AparatPlayer videoUrl={video} />
          </div>
        ) : (
          <div
            className="flex items-center justify-center w-full h-full 
          bg-slate-200 text-slate-600 text-lg"
          >
            ویدیو ندارد
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="text-xs text-gray-400 pb-2">
          {new Date(createdAt).toLocaleDateString("fa-IR")}
        </div>
      </div>
    </article>
  );
}
