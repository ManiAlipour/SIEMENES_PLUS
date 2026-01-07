"use client";
import BlogCard from "../features/BlogCard";
import Link from "next/link";
import { useFetch } from "iso-hooks";

interface IBlogsResponse {
  data: IBlog[];
  pagination: Pagination;
}

interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

interface IBlog {
  _id: string;
  title: string;
  video: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function BlogSection() {
  const {
    data,
    error,
    loading,
  } = useFetch<IBlogsResponse>("/api/blogs");

  const mainPageLimit = 6;
  const posts = data?.data ?? [];

  // Main rule: If there are any published posts, show (published and up to mainPageLimit)
  // If no published posts, and only drafts, show *all* draft posts (up to limit)
  const publishedPosts = posts.filter((post) => post.status === "published");
  let shownPosts: IBlog[] = [];

  if (publishedPosts.length > 0) {
    shownPosts = publishedPosts.slice(0, mainPageLimit);
  } else if (posts.length > 0) {
    // No published, but we have drafts, so show all
    shownPosts = posts.slice(0, mainPageLimit);
  }

  // Determine "no blogs" (not even drafts case)
  const noBlogs =
    !loading &&
    !error &&
    publishedPosts.length === 0;

  return (
    <section className="bg-gray-50/70 pt-16 md:pt-20 pb-12 md:pb-16">
      <div className="container mx-auto px-4">
        <h2
          className="relative text-2xl md:text-3xl font-vazir-bold text-gray-800 text-center mb-12
          after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:w-24 after:h-[2px] after:bg-primary"
        >
          تازه‌های وبلاگ
        </h2>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="text-gray-500 animate-pulse font-vazirmatn">
              در حال بارگذاری...
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center my-12">
            <div className="text-red-600 font-vazirmatn">
              خطا در دریافت پست‌های وبلاگ
            </div>
          </div>
        ) : noBlogs ? (
          <div className="flex flex-col items-center justify-center my-12">
            {/* Blog not found illustration or message */}
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-3 opacity-60"
            >
              <rect width="72" height="72" rx="16" fill="#F4F4F4" />
              <path
                d="M41 30C41 33.866 37.866 37 34 37C30.134 37 27 33.866 27 30C27 26.134 30.134 23 34 23C37.866 23 41 26.134 41 30Z"
                stroke="#BEC3CF"
                strokeWidth="2"
              />
              <path
                d="M22 48C22 43.0294 28.268 39 36 39C43.732 39 50 43.0294 50 48"
                stroke="#BEC3CF"
                strokeWidth="2"
              />
              <path
                d="M28 54H44"
                stroke="#D9D9D9"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-gray-500 font-vazirmatn text-lg">
              بلاگی یافت نشد
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shownPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link
            href="/blog"
            className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            مشاهده همه مقالات
          </Link>
        </div>
      </div>
    </section>
  );
}
