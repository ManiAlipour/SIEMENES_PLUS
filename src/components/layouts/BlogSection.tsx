// components/blog/BlogSection.tsx
import { blogPosts } from "@/data/blog-data";
import BlogCard, { PostCardModel } from "../features/BlogCard";
import Link from "next/link";

// تبدیل داده‌ها به مدل جدید پست سایت
function toPostCardModel(post: any): PostCardModel {
  return {
    _id: post._id ?? post.id ?? "",
    title: post.title,
    video: post.video ?? "",
    status: post.status ?? "draft",
    createdAt: post.createdAt ?? "",
  };
}

export default function BlogSection() {
  return (
    <section className="bg-gray-50/70 pt-16 md:pt-20 pb-12 md:pb-16">
      <div className="container mx-auto px-4">
        <h2
          className="relative text-2xl md:text-3xl font-vazir-bold text-gray-800 text-center mb-12
          after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:w-24 after:h-[2px] after:bg-primary"
        >
          تازه‌های وبلاگ
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => {
            const model = toPostCardModel(post);
            return <BlogCard key={model._id} post={model} />;
          })}
        </div>
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
