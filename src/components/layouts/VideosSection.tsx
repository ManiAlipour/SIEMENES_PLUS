"use client";

import VideoCard from "../features/VideoCard";
import Link from "next/link";
import { useFetch } from "iso-hooks";

interface IVideosResponse {
  data: IVideo[];
  pagination?: { total: number; page: number; pages: number; limit: number };
}

interface IVideo {
  _id: string;
  title: string;
  video: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function VideosSection() {
  const { data, error, loading } = useFetch<IVideosResponse>("/api/blogs");

  const mainPageLimit = 6;
  const posts = data?.data ?? [];
  const publishedPosts = posts.filter((p) => p.status === "published");
  const shownPosts =
    publishedPosts.length > 0
      ? publishedPosts.slice(0, mainPageLimit)
      : posts.slice(0, mainPageLimit);
  const noVideos = !loading && !error && publishedPosts.length === 0;

  return (
    <section className="bg-gray-50/70 pt-16 md:pt-20 pb-12 md:pb-16">
      <div className="container mx-auto px-4">
        <h2
          className="relative text-2xl md:text-3xl font-vazir-bold text-gray-800 text-center mb-12
          after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:w-24 after:h-[2px] after:bg-primary"
        >
          ویدیوها
        </h2>

        {loading ? (
          <div className="flex justify-center my-12 text-gray-500 animate-pulse font-vazirmatn">
            در حال بارگذاری...
          </div>
        ) : error ? (
          <div className="flex justify-center my-12 text-red-600 font-vazirmatn">
            خطا در دریافت ویدیوها
          </div>
        ) : noVideos ? (
          <div className="flex flex-col items-center justify-center my-12">
            <div className="text-gray-500 font-vazirmatn text-lg">
              ویدیویی یافت نشد
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shownPosts.map((post) => (
              <VideoCard key={post._id} video={post} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link
            href="/videos"
            className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            مشاهده همه ویدیوها
          </Link>
        </div>
      </div>
    </section>
  );
}
