import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import VideoCard from "../features/VideoCard";

async function getHomeVideos(limit = 6) {
  try {
    await connectDB();
    const posts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return posts.map((p: any) => ({
      _id: String(p._id),
      title: p.title as string,
      video: p.video as string,
      status: p.status as "draft" | "published",
      createdAt:
        p.createdAt instanceof Date
          ? p.createdAt.toISOString()
          : String(p.createdAt),
    }));
  } catch {
    return null;
  }
}

export default async function VideosSection() {
  const videos = await getHomeVideos(6);

  return (
    <section
      className="border-t border-slate-200/80 bg-white py-16 md:py-20"
      aria-labelledby="videos-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-primary">
              آموزش و معرفی
            </p>
            <h2
              id="videos-heading"
              className="text-2xl font-black text-slate-900 md:text-3xl"
            >
              ویدیوهای تخصصی
            </h2>
          </div>
          <Link
            href="/videos"
            className="text-sm font-bold text-primary transition hover:underline"
          >
            همه ویدیوها
          </Link>
        </header>

        {videos === null ? (
          <p className="py-10 text-center text-sm text-red-600">
            خطا در دریافت ویدیوها
          </p>
        ) : videos.length === 0 ? (
          <p className="py-10 text-center text-slate-500">ویدیویی یافت نشد</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
