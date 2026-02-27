"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
          وبلاگ
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          مقالات و اخبار تخصصی اتوماسیون صنعتی و تجهیزات زیمنس
        </p>
        {tag && (
          <p className="mt-2 text-sm text-cyan-600">
            فیلتر تگ: <strong>{tag}</strong>
            <Link href="/blog" className="mr-2 text-slate-500 hover:underline">
              (حذف فیلتر)
            </Link>
          </p>
        )}
      </header>

      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجو در مطالب..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
            aria-label="جستجو در وبلاگ"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition"
        >
          جستجو
        </button>
      </form>

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
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        search || tag ? (
          <div className="text-center py-20 px-4">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FiSearch size={28} />
            </div>
            <p className="mb-1 text-lg font-medium text-slate-600">مطلبی یافت نشد</p>
            <p className="text-sm text-slate-500">
              عبارت جستجو یا تگ را تغییر دهید.
            </p>
          </div>
        ) : (
          <BlogNotFound />
        )
      ) : (
        <>
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="لیست مطالب وبلاگ">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </section>

          {pages > 1 && (
            <nav className="flex flex-wrap justify-center items-center gap-2 mt-12" aria-label="صفحه‌بندی">
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
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-cyan-50 hover:border-cyan-200 text-slate-700 font-medium transition-colors"
                >
                  قبلی
                </Link>
              )}
              <span className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-medium shadow-sm">
                {currentPage} از {pages}
              </span>
              {currentPage < pages && (
                <Link
                  href={`/blog?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-cyan-50 hover:border-cyan-200 text-slate-700 font-medium transition-colors"
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
