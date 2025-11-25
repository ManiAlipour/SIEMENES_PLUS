import type { ReactNode } from "react";

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
      {/* هدر صفحه پست‌ها */}
      <header className="mb-8 space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
          وبلاگ و مقالات
        </h1>
        <p className="text-gray-500 text-base">
          جدیدترین نوشته‌ها و اخبار را اینجا مطالعه کنید.
        </p>
      </header>

      <section>
        {children}
      </section>
    </main>
  );
}
