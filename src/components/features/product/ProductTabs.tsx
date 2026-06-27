"use client";

import { useState } from "react";
import { FiChevronDown, FiFileText, FiHelpCircle, FiList } from "react-icons/fi";
import type { ProductFAQ } from "@/lib/products/productSeo";

type TabId = "description" | "specs" | "faq";

type ProductTabsProps = {
  description: string;
  specs: Record<string, string>;
  faqs: ProductFAQ[];
  productName: string;
};

const TABS: { id: TabId; label: string; icon: typeof FiFileText }[] = [
  { id: "description", label: "توضیحات", icon: FiFileText },
  { id: "specs", label: "مشخصات فنی", icon: FiList },
  { id: "faq", label: "سوالات متداول", icon: FiHelpCircle },
];

export default function ProductTabs({
  description,
  specs,
  faqs,
  productName,
}: ProductTabsProps) {
  const specEntries = Object.entries(specs);
  const hasSpecs = specEntries.length > 0;
  const [activeTab, setActiveTab] = useState<TabId>(
    hasSpecs ? "description" : "description",
  );
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section
      className="rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/30"
      aria-label={`جزئیات ${productName}`}
    >
      <div
        role="tablist"
        aria-label="بخش‌های اطلاعات محصول"
        className="flex overflow-x-auto border-b border-slate-100 scrollbar-thin"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const disabled = id === "specs" && !hasSpecs;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              disabled={disabled}
              onClick={() => setActiveTab(id)}
              className={`relative flex shrink-0 items-center gap-2 px-5 py-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40 ${
                activeTab === id
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
              {activeTab === id && (
                <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-7">
        {activeTab === "description" && (
          <div
            role="tabpanel"
            id="panel-description"
            aria-labelledby="tab-description"
            className="prose prose-slate max-w-none"
          >
            <p className="text-base leading-8 text-slate-700 whitespace-pre-line">
              {description}
            </p>
          </div>
        )}

        {activeTab === "specs" && hasSpecs && (
          <div
            role="tabpanel"
            id="panel-specs"
            aria-labelledby="tab-specs"
            className="overflow-x-auto rounded-2xl border border-slate-100"
          >
            <table className="min-w-full divide-y divide-slate-100 text-right text-sm">
              <thead>
                <tr className="bg-primary/95">
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-white"
                  >
                    مشخصه
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-white"
                  >
                    مقدار
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {specEntries.map(([key, value], index) => (
                  <tr
                    key={key}
                    className={index % 2 === 0 ? "bg-slate-50/50" : "bg-white"}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700"
                    >
                      {key}
                    </th>
                    <td className="px-4 py-3 text-slate-600 break-words">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "faq" && (
          <div
            role="tabpanel"
            id="panel-faq"
            aria-labelledby="tab-faq"
            className="space-y-2"
          >
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50"
                >
                  <button
                    type="button"
                    id={`faq-trigger-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-right text-sm font-bold text-slate-800 transition hover:bg-slate-100/80"
                  >
                    <span>{faq.question}</span>
                    <FiChevronDown
                      className={`h-5 w-5 shrink-0 text-primary transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${index}`}
                      className="border-t border-slate-100 px-4 py-3 text-sm leading-7 text-slate-600"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
