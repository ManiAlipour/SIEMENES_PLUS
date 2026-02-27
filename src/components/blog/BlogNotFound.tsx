 "use client";

import { FiFileText } from "react-icons/fi";

interface BlogNotFoundProps {
  showDescription?: boolean;
}

export default function BlogNotFound({
  showDescription = true,
}: BlogNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 shadow-sm">
        <FiFileText size={32} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-800 md:text-xl">
        هنوز مطلبی در وبلاگ منتشر نشده است
      </h2>
      {showDescription && (
        <p className="mt-2 max-w-md text-sm text-slate-500 md:text-base">
          به‌زودی مقالات آموزشی، نکات فنی و اخبار تازه در این
          بخش منتشر می‌شود. لطفاً در زمان دیگری دوباره سر بزنید.
        </p>
      )}
    </div>
  );
}

