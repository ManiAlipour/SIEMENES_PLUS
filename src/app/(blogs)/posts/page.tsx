import type { Metadata } from "next";
import Link from "next/link";

// Dummy Data (Replace with actual data fetching in production)
const posts = [
  {
    id: "1",
    title: "آغاز یک سفر دانشی: چرا وبلاگ‌نویسی مهم است؟",
    slug: "why-blogging-matters",
    summary:
      "در این مقاله بررسی می‌کنیم که چگونه وبلاگ‌نویسی می‌تواند به رشد دانش فنی و دیده‌شدن بیشتر کمک کند.",
    image: "/images/blog/1.jpg",
    createdAt: "2024-06-02",
    category: "آموزشی",
    author: "محمد عزیزی",
  },
  {
    id: "2",
    title: "۵ ترند برتر طراحی UI در سال ۱۴۰۳",
    slug: "top-5-ui-trends",
    summary:
      "جدیدترین سبک‌های طراحی رابط کاربری که در سال پیش‌رو می‌توانند تاثیرگذار باشند را بشناسید.",
    image: "/images/blog/2.jpg",
    createdAt: "2024-06-10",
    category: "طراحی",
    author: "سارا احمدی",
  },
  {
    id: "3",
    title: "چرا SEO هنوز مهم‌ترین عامل رشد وبسایت است؟",
    slug: "seo-still-key",
    summary:
      "مروری بر دلایل اهمیت سئو در موفقیت وبسایت‌ها و نکات کلیدی برای رشد رتبه در گوگل.",
    image: "/images/blog/3.jpg",
    createdAt: "2024-05-25",
    category: "سئو",
    author: "علیرضا فیضی",
  },
];

// Metadata for SEO
export const metadata: Metadata = {
  title: "وبلاگ و مقالات تخصصی | بهترین مطالب آموزش، طراحی و سئو",
  description:
    "جدیدترین و جذاب‌ترین مقالات درباره توسعه وب، طراحی رابط کاربری، سئو و اخبار تکنولوژی را بخوانید. یادگیری و رشد با بهترین بلاگ فارسی.",
  openGraph: {
    title: "وبلاگ و مقالات تخصصی",
    description:
      "مطالعه آخرین مطالب آموزشی و تخصصی حوزه وب و تکنولوژی. الهام بگیرید و پیشرفت کنید.",
    url: "https://your-domain.com/posts",
    siteName: "فروشگاه و وبلاگ تخصصی",
    images: [
      {
        url: "/og/blog.png",
        width: 1200,
        height: 630,
        alt: "وبلاگ تخصصی",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "وبلاگ و مقالات تخصصی",
    description:
      "مطالعه آخرین مطالب آموزشی و تخصصی حوزه وب و تکنولوژی.",
    images: ["/og/blog.png"],
  },
};

// Helper: Format Persian date
const formatDateFa = (dateString: string) =>
  new Date(dateString).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function PostsPage() {
  return (
    <>
      {/* Breadcrumb JSON-LD for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "خانه",
                item: "https://your-domain.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "وبلاگ",
                item: "https://your-domain.com/posts",
              },
            ],
          }),
        }}
      />
      {/* Posts Grid */}
      <section className="py-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group bg-gradient-to-br from-white via-gray-50 to-blue-50 border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative flex flex-col"
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            {/* Post Image */}
            <Link href={`/posts/${post.slug}`} className="block relative aspect-[4/3] bg-gray-100 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                itemProp="image"
              />
              <span className="absolute top-3 right-3 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 select-none">
                {post.category}
              </span>
            </Link>
            {/* Content */}
            <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
              <Link href={`/posts/${post.slug}`}>
                <h2
                  className="font-extrabold text-lg sm:text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors"
                  itemProp="headline"
                  title={post.title}
                >
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 text-[15px] mb-3 line-clamp-2" itemProp="description">
                {post.summary}
              </p>
              <div className="flex items-center justify-between mt-auto pt-2 text-sm text-gray-500">
                <span itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{post.author}</span>
                </span>
                <time dateTime={post.createdAt} itemProp="datePublished">
                  {formatDateFa(post.createdAt)}
                </time>
              </div>
            </div>
            {/* Schema.org microdata */}
            <meta itemProp="mainEntityOfPage" content={`https://your-domain.com/posts/${post.slug}`} />
            <meta itemProp="datePublished" content={post.createdAt} />
            <meta itemProp="dateModified" content={post.createdAt} />
            <meta itemProp="author" content={post.author} />
          </article>
        ))}
      </section>

      {/* Structured Data: Blog Schema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "وبلاگ و مقالات تخصصی",
            description:
              "جدیدترین و تخصصی‌ترین مقالات فارسی درباره توسعه وب، طراحی UI و سئو.",
            url: "https://your-domain.com/posts",
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.summary,
              image: post.image,
              url: `https://your-domain.com/posts/${post.slug}`,
              author: {
                "@type": "Person",
                name: post.author,
              },
              datePublished: post.createdAt,
            })),
          }),
        }}
      />
    </>
  );
}
