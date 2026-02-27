"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import VideoCard from "@/components/features/VideoCard";
import Link from "next/link";

interface Video {
  _id: string;
  title: string;
  video: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function VideosListClient() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [posts, setPosts] = useState<Video[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    pages: number;
    limit: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("status", "published");
    params.set("limit", "12");
    params.set("page", String(page));
    fetch(`/api/blogs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data?.data ?? []);
        setPagination(data?.pagination ?? null);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page]);

  const total = pagination?.total ?? 0;
  const pages = pagination?.pages ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
          ویدیوها
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          ویدیوهای آموزشی و معرفی محصولات اتوماسیون صنعتی
        </p>
      </header>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-slate-200" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-lg">
          ویدیویی یافت نشد
        </div>
      ) : (
        <>
          <section
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="لیست ویدیوها"
          >
            {posts.map((post) => (
              <VideoCard key={post._id} video={post} />
            ))}
          </section>

          {pages > 1 && (
            <nav
              className="flex flex-wrap justify-center gap-2 mt-10"
              aria-label="صفحه‌بندی"
            >
              {currentPage > 1 && (
                <Link
                  href={
                    currentPage === 2
                      ? "/videos"
                      : `/videos?page=${currentPage - 1}`
                  }
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  قبلی
                </Link>
              )}
              <span className="px-4 py-2 rounded-xl bg-cyan-100 text-cyan-800 font-medium">
                {currentPage} از {pages}
              </span>
              {currentPage < pages && (
                <Link
                  href={`/videos?page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  بعدی
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
