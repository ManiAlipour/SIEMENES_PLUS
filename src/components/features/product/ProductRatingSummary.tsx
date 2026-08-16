import Link from "next/link";
import { FaStar } from "react-icons/fa";

interface ProductRatingSummaryProps {
  averageRating: number;
  reviewCount: number;
}

export default function ProductRatingSummary({
  averageRating,
  reviewCount,
}: ProductRatingSummaryProps) {
  if (!reviewCount) {
    return (
      <Link
        href="#product-reviews"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-amber-700"
      >
        <FaStar className="text-slate-300" size={14} />
        <span>اولین نفر باشید که امتیاز می‌دهد</span>
      </Link>
    );
  }

  const rounded = Math.round(averageRating);

  return (
    <Link
      href="#product-reviews"
      className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/60 px-3.5 py-2 transition hover:bg-amber-50"
    >
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <FaStar
            key={n}
            size={14}
            className={n <= rounded ? "text-amber-400" : "text-slate-200"}
          />
        ))}
      </span>
      <span className="text-sm font-bold tabular-nums text-slate-800">
        {averageRating.toLocaleString("fa-IR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}
      </span>
      <span className="text-xs text-slate-500">
        ({reviewCount.toLocaleString("fa-IR")} نظر)
      </span>
    </Link>
  );
}
