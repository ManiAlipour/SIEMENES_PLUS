import Link from "next/link";
import AparatPlayer from "./AparatPlayer";

export interface VideoCardModel {
  _id: string;
  title: string;
  video: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function VideoCard({
  video: videoPost,
}: {
  video: VideoCardModel;
}) {
  const { title, video, status, createdAt } = videoPost;

  if (status === "draft") return null;

  return (
    <article
      className="group flex flex-col overflow-hidden border border-slate-200 bg-white transition hover:border-primary/40"
      aria-label={`ویدیو: ${title}`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#0b1f33]">
        {video ? (
          <AparatPlayer videoUrl={video} title={title} autoLoad={false} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            ویدیو ندارد
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="text-base font-bold leading-7 text-slate-900 transition group-hover:text-primary md:text-lg">
          <Link href="/videos" className="focus:outline-none">
            {title}
          </Link>
        </h3>
        <time
          dateTime={new Date(createdAt).toISOString()}
          className="text-xs text-slate-400"
        >
          {new Date(createdAt).toLocaleDateString("fa-IR")}
        </time>
      </div>
    </article>
  );
}
