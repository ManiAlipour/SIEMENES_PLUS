"use client";

import Link from "next/link";
import { useFetch } from "iso-hooks";
import BlogCard from "../features/BlogCard";
import BlogNotFound from "@/components/blog/BlogNotFound";

interface IBlogPostsResponse {
  data: IBlogPost[];
  pagination?: { total: number; page: number; pages: number; limit: number };
}

interface IBlogPost {
  _id: string;
  title: string;
  slug?: string | null;
  excerpt?: string;
  coverImage?: string;
  video?: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function BlogSection() {
  const { data, error, loading } = useFetch<IBlogPostsResponse>(
    "/api/blog-posts?status=published&limit=6",
  );

  const posts = data?.data ?? [];
  const noBlogs = !loading && !error && posts.length === 0;

  return (
    <section className="bg-gray-50/70 pt-16 md:pt-20 pb-12 md:pb-16">
      <div className="container mx-auto px-4">
        <h2
          className="relative mb-12 text-center text-2xl font-vazir-bold text-gray-800 md:text-3xl
          after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-24 after:-translate-x-1/2 after:bg-primary"
        >
          تازه‌های وبلاگ
        </h2>

        {loading ? (
          <div className="my-12 flex justify-center text-gray-500 font-vazirmatn animate-pulse">
            در حال بارگذاری...
          </div>
        ) : error ? (
          <div className="my-12 flex justify-center text-red-600 font-vazirmatn">
            خطا در دریافت مطالب وبلاگ
          </div>
        ) : noBlogs ? (
          <BlogNotFound />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="rounded-md border border-primary px-6 py-2 text-primary transition-colors hover:bg-primary hover:text-white"
          >
            مشاهده همه مقالات
          </Link>
        </div>
      </div>
    </section>
  );
}

