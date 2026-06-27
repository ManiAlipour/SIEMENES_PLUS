import Link from "next/link";
import BlogCard from "../features/BlogCard";
import BlogNotFound from "@/components/blog/BlogNotFound";

// تایپ‌ها رو همین‌جا نگه می‌داریم
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

// تابع واکشی دیتا در سمت سرور
async function getBlogPosts() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${base}/api/blog-posts?status=published&limit=6`, {
      next: { revalidate: 3600 }, // هر یک ساعت کش رو آپدیت می‌کنه (ISR)
    });
    if (!res.ok) return null;
    return (await res.json()) as IBlogPostsResponse;
  } catch (error) {
    console.error("Blog fetch error:", error);
    return null;
  }
}

export default async function BlogSection() {
  const data = await getBlogPosts();
  const posts = data?.data ?? [];
  const noBlogs = posts.length === 0;

  return (
    <section className="bg-gray-50/70 pt-16 md:pt-20 pb-12 md:pb-16">
      <div className="container mx-auto px-4">
          <h2
          className="relative mb-12 text-center text-2xl font-vazir-bold text-gray-800 md:text-3xl
          after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-24 after:-translate-x-1/2 after:bg-primary"
        >
          تازه‌های مجله تکنولوژی زیمنس پلاس
        </h2>

        {!data ? (
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
            مشاهده همه مقالات تخصصی
          </Link>
        </div>
      </div>
    </section>
  );
}
