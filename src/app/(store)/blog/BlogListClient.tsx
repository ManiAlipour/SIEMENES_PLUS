"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiBookOpen, FiSearch } from "react-icons/fi";
import BlogCard from "@/components/features/BlogCard";
import BlogNotFound from "@/components/blog/BlogNotFound";

interface BlogSummary {
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

interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export default function BlogListClient() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";

  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("status", "published");
    params.set("limit", "12");
    params.set("page", String(page));
    if (search) params.set("search", search);
    if (tag) params.set("tag", tag);
    fetch(`/api/blog-posts?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data?.data ?? []);
        setPagination(data?.pagination ?? null);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page, search, tag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("search", searchInput.trim());
    if (tag) params.set("tag", tag);
    params.set("page", "1");
    window.location.href = `/blog?${params.toString()}`;
  };

  const pages = pagination?.pages ?? 1;
  const currentPage = pagination?.page ?? 1;
  const total = pagination?.total ?? posts.length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(34,211,238,0.25), transparent 50%), radial-gradient(circle at 80% 20%, rgba(6,182,212,0.15), transparent 40%)",
          }}
        />
        <div className="container relative mx-auto max-w-5xl px-4 py-12 sm:py-16 md:py-20 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <FiBookOpen size={28} className="text-cyan-300" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
            وبلاگ تخصصی
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            مقالات، راهنماها و اخبار  PLC، اینورتر و تجهیزات زیمنس
          </p>
          {!loading && total > 0 && (
            <p className="mt-4 text-sm text-cyan-200/90">
              {total} مطلب منتشر شده
            </p>
          )}
          {tag && (
            <p className="mt-4 text-sm">
              <span className="text-slate-400">فیلتر:</span>{" "}
              <span className="font-semibold text-cyan-200">{tag}</span>
              <Link
                href="/blog"
                className="mr-3 text-slate-400 hover:text-white underline underline-offset-2"
              >
                حذف فیلتر
              </Link>
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <form
          onSubmit={handleSearch}
          className="max-w-xl mx-auto mb-10 sm:mb-12 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <FiSearch
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="جستجو در عنوان و خلاصه مطالب..."
              className="w-full pl-4 pr-11 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 outline-none text-sm"
              aria-label="جستجو در وبلاگ"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 shadow-md shadow-cyan-600/20 transition-colors shrink-0"
          >
            جستجو
          </button>
        </form>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 rounded w-4/5" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          search || tag ? (
            <div className="text-center py-24 px-4 rounded-3xl border border-dashed border-slate-200 bg-white">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FiSearch size={28} />
              </div>
              <p className="mb-1 text-lg font-semibold text-slate-700">
                مطلبی یافت نشد
              </p>
              <p className="text-sm text-slate-500 mb-6">
                عبارت جستجو یا تگ را تغییر دهید.
              </p>
              <Link
                href="/blog"
                className="inline-flex px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700"
              >
                مشاهده همه مطالب
              </Link>
            </div>
          ) : (
            <BlogNotFound />
          )
        ) : (
          <>
            <section
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="لیست مطالب وبلاگ"
            >
              {posts.map((post, index) => (
                <BlogCard key={post._id} post={post} featured={index === 0 && !search && !tag && page === 1} />
              ))}
            </section>

            {pages > 1 && (
              <nav
                className="flex flex-wrap justify-center items-center gap-2 mt-14"
                aria-label="صفحه‌بندی"
              >
                {currentPage > 1 && (
                  <Link
                    href={
                      currentPage === 2
                        ? (() => {
                            const p = new URLSearchParams();
                            if (search) p.set("search", search);
                            if (tag) p.set("tag", tag);
                            const q = p.toString();
                            return q ? `/blog?${q}` : "/blog";
                          })()
                        : `/blog?page=${currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`
                    }
                    className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-cyan-50 hover:border-cyan-200 text-slate-700 font-medium transition-colors"
                  >
                    قبلی
                  </Link>
                )}
                <span className="min-h-[44px] inline-flex items-center px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold shadow-sm">
                  {currentPage} از {pages}
                </span>
                {currentPage < pages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-cyan-50 hover:border-cyan-200 text-slate-700 font-medium transition-colors"
                  >
                    بعدی
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
