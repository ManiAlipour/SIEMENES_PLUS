"use client";

import type { Category } from "./types";

const CARD_STYLES =
  "rounded-2xl border border-slate-200/60 bg-white/75 backdrop-blur-xl " +
  "shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(6,182,212,0.07)] " +
  "p-3 sm:p-6 transition-all duration-300";

const DELETE_BTN =
  "px-2 py-1 text-xs text-red-600 bg-red-500/10 rounded-lg border border-red-500/20 " +
  "hover:bg-red-600 hover:text-white transition-all duration-200";
const DELETE_BTN_MOBILE =
  "px-3 py-1 text-xs text-red-600 bg-red-500/10 rounded-xl border border-red-500/20 " +
  "hover:bg-red-600 hover:text-white transition-all duration-200";

type CategoriesListProps = {
  categories: Category[];
  loading: boolean;
  errorMsg: string;
  onDelete: (id: string) => void;
  getParentName: (parentId: string | null | undefined) => string;
};

/**
 * Resolves parent category display name from id using the current list.
 */
export function getParentNameFromList(
  parentId: string | null | undefined,
  categories: Category[]
): string {
  if (!parentId) return "—";
  const parent = categories.find((c) => c._id === parentId);
  return parent ? parent.name : "—";
}

/**
 * Renders a single category row for desktop table.
 */
function CategoryTableRow({
  category,
  onDelete,
  getParentName,
}: {
  category: Category;
  onDelete: (id: string) => void;
  getParentName: (parentId: string | null | undefined) => string;
}) {
  return (
    <tr className="border-b border-slate-200 hover:bg-cyan-50/60 transition-colors">
      <td className="py-2">{category.name}</td>
      <td className="py-2 break-all ltr:font-mono ltr:direction-ltr">{category.slug}</td>
      <td className="py-2">{getParentName(category.parent)}</td>
      <td className="py-2 text-center">
        {category.image ? (
          <a href={category.image} target="_blank" rel="noopener noreferrer" className="inline-block">
            <img src={category.image} alt={category.name} className="w-10 h-10 object-cover rounded-lg mx-auto" />
          </a>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )}
      </td>
      <td className="py-2 text-right">
        {category.isFeatured ? (
          <span className="inline-flex items-center gap-1 text-cyan-600 font-bold">بله</span>
        ) : (
          <span className="text-slate-400">خیر</span>
        )}
      </td>
      <td className="py-2 text-right">
        <button type="button" onClick={() => onDelete(category._id)} className={DELETE_BTN}>
          حذف
        </button>
      </td>
    </tr>
  );
}

/**
 * Mobile card for a single category.
 */
function CategoryCard({
  category,
  onDelete,
  getParentName,
}: {
  category: Category;
  onDelete: (id: string) => void;
  getParentName: (parentId: string | null | undefined) => string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white/90 shadow hover:shadow-md p-3 transition-all duration-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {category.image ? (
            <a href={category.image} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-12 h-12 object-cover rounded-lg bg-slate-100 border"
              />
            </a>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-slate-300 bg-slate-100 rounded-lg border text-xl select-none">
              <span>—</span>
            </div>
          )}
          <div>
            <div className="font-bold text-gray-900 text-base">{category.name}</div>
            <div className="text-xs text-gray-400 break-all ltr:font-mono ltr:direction-ltr">{category.slug}</div>
          </div>
        </div>
        <button type="button" onClick={() => onDelete(category._id)} className={DELETE_BTN_MOBILE}>
          حذف
        </button>
      </div>
      <div className="flex items-center flex-wrap justify-between mt-3 gap-y-2 gap-x-4 pl-1">
        <div className="flex flex-col flex-1">
          <span className="text-[12px] text-slate-400">دسته والد:</span>
          <span className="text-sm font-medium text-slate-700">{getParentName(category.parent)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-slate-400">منتخب:</span>
          <span className={`text-[13px] font-semibold ${category.isFeatured ? "text-cyan-600" : "text-slate-400"}`}>
            {category.isFeatured ? "بله" : "خیر"}
          </span>
        </div>
      </div>
      {category.description && (
        <div className="mt-3 text-xs text-gray-500 leading-relaxed border-t border-slate-100 pt-2">
          {category.description}
        </div>
      )}
    </div>
  );
}

/**
 * Categories list: loading/error/empty states, then either mobile cards or desktop table.
 */
export default function CategoriesList({
  categories,
  loading,
  errorMsg,
  onDelete,
  getParentName,
}: CategoriesListProps) {
  return (
    <div className={CARD_STYLES}>
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-cyan-700">
        لیست دسته‌ها
      </h2>

      {loading && <p className="text-slate-500">در حال دریافت اطلاعات...</p>}
      {!loading && errorMsg && <p className="text-red-500">{errorMsg}</p>}
      {!loading && !errorMsg && categories.length === 0 && (
        <p className="text-slate-500 text-sm">هنوز دسته‌ای ثبت نشده است.</p>
      )}

      {!loading && !errorMsg && categories.length > 0 && (
        <>
          <div className="flex flex-col gap-3 md:hidden">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onDelete={onDelete}
                getParentName={getParentName}
              />
            ))}
          </div>
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-sm text-gray-700 min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="py-2 text-right whitespace-nowrap">نام</th>
                  <th className="py-2 text-right whitespace-nowrap">شناسه</th>
                  <th className="py-2 text-right whitespace-nowrap">دسته والد</th>
                  <th className="py-2 text-center whitespace-nowrap">تصویر</th>
                  <th className="py-2 text-right whitespace-nowrap">منتخب؟</th>
                  <th className="py-2 text-right whitespace-nowrap">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <CategoryTableRow
                    key={cat._id}
                    category={cat}
                    onDelete={onDelete}
                    getParentName={getParentName}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
