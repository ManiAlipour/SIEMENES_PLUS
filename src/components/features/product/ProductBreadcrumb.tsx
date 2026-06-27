import Link from "next/link";
import { FiChevronLeft, FiHome } from "react-icons/fi";

type Crumb = { label: string; href: string };

export default function ProductBreadcrumb({ product }: { product: Product }) {
  const crumbs: Crumb[] = [
    { label: "خانه", href: "/" },
    { label: "فروشگاه", href: "/shop" },
    ...(product.category
      ? [{ label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` }]
      : []),
    { label: product.name, href: `/shop/${product.slug}` },
  ];

  return (
    <nav
      aria-label="مسیر دسترسی"
      className="mb-6 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && (
              <FiChevronLeft
                className="shrink-0 text-slate-300"
                aria-hidden
              />
            )}
            {i === crumbs.length - 1 ? (
              <span
                className="truncate font-semibold text-slate-800 max-w-[200px] sm:max-w-md"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="inline-flex items-center gap-1 text-slate-500 transition-colors hover:text-primary"
              >
                {i === 0 && <FiHome className="h-3.5 w-3.5" aria-hidden />}
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
