import Link from "next/link";
import BlogCard from "../features/BlogCard";
import BlogNotFound from "@/components/blog/BlogNotFound";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

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

async function getHomeBlogPosts(limit = 6): Promise<IBlogPost[] | null> {
  try {
    await connectDB();
    const posts = await BlogPost.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title slug excerpt coverImage video status createdAt")
      .lean();

    return posts.map((p: any) => ({
      _id: String(p._id),
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      video: p.video,
      status: p.status,
      createdAt:
        p.createdAt instanceof Date
          ? p.createdAt.toISOString()
          : String(p.createdAt),
    }));
  } catch {
    return null;
  }
}

export default async function BlogSection() {
  const posts = await getHomeBlogPosts(6);

  return (
    <section
      className="bg-[#f3f5f7] py-16 md:py-20"
      aria-labelledby="blog-heading"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-primary">
              مجله تخصصی
            </p>
            <h2
              id="blog-heading"
              className="text-2xl font-black text-slate-900 md:text-3xl"
            >
              تازه‌های وبلاگ زیمنس پلاس
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-bold text-primary transition hover:underline"
          >
            همه مقالات
          </Link>
        </header>

        {posts === null ? (
          <p className="py-10 text-center text-sm text-red-600">
            خطا در دریافت مطالب وبلاگ
          </p>
        ) : posts.length === 0 ? (
          <BlogNotFound />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
