"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { stripEditorChrome } from "@/components/admin/blogRichEditor/utils";

const ProductCard = dynamic(
  () => import("@/components/features/ProductCard").then((m) => m.default),
  { ssr: false }
);

interface EmbeddedProduct {
  productId: string;
  slug: string;
  blockId: string;
}

interface BlogPostContentProps {
  content: string;
  embeddedProducts: EmbeddedProduct[];
}

type Segment =
  | { type: "html"; value: string }
  | { type: "product"; blockId: string };

function parseContentWithEmbeds(html: string): Segment[] {
  const segments: Segment[] = [];
  const regex =
    /<div[^>]*data-block-id="([^"]+)"[^>]*class="[^"]*blog-product-embed[^"]*"[^>]*>[\s\S]*?<\/div>|<div[^>]*class="[^"]*blog-product-embed[^"]*"[^>]*data-block-id="([^"]+)"[^>]*>[\s\S]*?<\/div>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "html", value: html.slice(lastIndex, match.index) });
    }
    const blockId = match[1] || match[2];
    if (blockId) segments.push({ type: "product", blockId });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < html.length) {
    segments.push({ type: "html", value: html.slice(lastIndex) });
  } else if (segments.length === 0 && html.trim()) {
    segments.push({ type: "html", value: html });
  }
  return segments;
}

function BlogEmbeddedProduct({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const id =
      typeof productId === "string"
        ? productId
        : (productId as any)?.toString?.();
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        const p = d?.product ?? d?.data ?? d;
        if (p && (p._id || p.name)) setProduct(p);
      })
      .catch(() => {});
  }, [productId]);

  if (!product) {
    return (
      <div className="my-6 p-4 rounded-xl bg-slate-100 text-slate-500 text-center">
        در حال بارگذاری محصول…
      </div>
    );
  }

  const id =
    typeof product._id === "string"
      ? product._id
      : (product._id as any)?.toString?.() ?? productId;

  return (
    <div className="my-6 flex justify-center">
      <div className="w-full max-w-sm">
        <ProductCard
          id={id}
          name={product.name}
          image={product.image}
          brand={product.brand}
          isFeatured={product.isFeatured}
          slug={product.slug || slug}
        />
      </div>
    </div>
  );
}

// --- UI/UX Prose Styles ---
// اولویت با خوانایی و ریسپانسیو. بهبود قابل‌توجه برای جدول و لیست و تصاویر.
const PROSE_CLASS = [
  "prose", // Tailwind Typography
  "prose-slate",
  "max-w-none",
  "prose-headings:font-bold",
  "prose-headings:tracking-tight",
  "prose-img:rounded-xl",
  "prose-img:mx-auto",
  "prose-img:my-4",
  "prose-a:text-cyan-600",
  "prose-a:transition-colors",
  "prose-a:hover:text-primary",
  "prose-pre:bg-slate-900",
  "prose-pre:text-white",
  "prose-table:bg-white",
  "prose-table:rounded-xl",
  "prose-table:shadow-sm",
  "prose-thead:bg-slate-50",
  "prose-th:px-4",
  "prose-th:py-3",
  "prose-th:text-slate-700",
  "prose-th:text-center",
  "prose-td:px-4",
  "prose-td:py-2",
  "prose-td:text-slate-600",
  "prose-td:text-center",
  "prose-tr:border-b",
  "prose-tr:last:border-b-0",
  "blog-responsive-table"
].join(" ");

export default function BlogPostContent({
  content,
  embeddedProducts,
}: BlogPostContentProps) {
  const segments = useMemo(() => parseContentWithEmbeds(content || ""), [content]);
  const productByBlockId = useMemo(() => {
    const m: Record<string, EmbeddedProduct> = {};
    (embeddedProducts || []).forEach((p) => {
      m[p.blockId] = p;
    });
    return m;
  }, [embeddedProducts]);

  if (!content && (!embeddedProducts || embeddedProducts.length === 0)) {
    return null;
  }

  // جدول‌هـا: همیشه هر جدول را داخل یک wrapper اسکرولی قرار بده
  useEffect(() => {
    const contentElem = document.querySelector(".blog-post-content");
    if (contentElem) {
      const tables = contentElem.querySelectorAll("table");
      tables.forEach((tbl) => {
        if (!tbl.parentElement?.classList.contains("blog-table-scroll")) {
          const wrapper = document.createElement("div");
          wrapper.className =
            "blog-table-scroll overflow-x-auto bg-white rounded-xl shadow-md my-4";
          tbl.parentNode?.insertBefore(wrapper, tbl);
          wrapper.appendChild(tbl);
        }
      });
    }
  }, [content, segments.length]);

  // لیست‌ها: شفافیت outline و spacing و مارکرهای خوانا
  useEffect(() => {
    const contentElem = document.querySelector(".blog-post-content");
    if (contentElem) {
      const uls = contentElem.querySelectorAll("ul");
      const ols = contentElem.querySelectorAll("ol");
      uls.forEach((ul) => {
        ul.classList.add(
          "list-disc",
          "!pl-6",
          "!pr-4",
          "marker:text-primary",
          "marker:font-bold",
          "my-4",
          "rtl:pr-8",
        );
      });
      ols.forEach((ol) => {
        ol.classList.add(
          "list-decimal",
          "!pl-8",
          "!pr-4",
          "marker:text-primary",
          "marker:font-bold",
          "my-4",
          "rtl:pr-8",
        );
      });
    }
  }, [content, segments.length]);

  return (
    <div className="blog-post-content" dir="auto">
      {segments.map((seg, i) => {
        if (seg.type === "html") {
          return (
            <div
              key={i}
              dir="auto"
              className={PROSE_CLASS}
              dangerouslySetInnerHTML={{ __html: stripEditorChrome(seg.value) }}
            />
          );
        }
        const product = productByBlockId[seg.blockId];
        if (!product) return null;
        return (
          <BlogEmbeddedProduct
            key={i}
            productId={product.productId}
            slug={product.slug}
          />
        );
      })}
      <style jsx global>{`
        /* جدول ریسپانسیو */
        .blog-responsive-table table {
          min-width: 600px;
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 1rem;
          transition: box-shadow .2s;
        }
        .blog-table-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .blog-post-content table th,
        .blog-post-content table td {
          padding: 0.75rem 1rem!important;
          border: 1px solid #e2e8f0 !important;
        }
        .blog-post-content table th {
          background: #f9fafb;
          font-weight: 700;
          color: #334155;
          text-align: center;
        }
        .blog-post-content table td {
          color: #475569;
          background: #fff;
        }
        @media (max-width: 900px) {
          .blog-responsive-table table {
            min-width: 480px;
            font-size: .94rem;
          }
          .blog-table-scroll {
            margin-left: -1rem;
            margin-right: -1rem;
            border-radius: 0;
          }
          .blog-post-content .prose img {
            max-width: 96vw;
            margin-left: auto;
            margin-right: auto;
          }
        }
        @media (max-width: 640px) {
          .blog-responsive-table table {
            min-width: 380px;
            font-size: .89rem;
          }
        }
        /* لیست‌ها */
        .blog-post-content ul,
        .blog-post-content ol {
          max-width: 100%;
        }
        .blog-post-content ul {
          list-style-type: disc;
        }
        .blog-post-content ol {
          list-style-type: decimal;
        }
        .blog-post-content ul,
        .blog-post-content ol {
          padding-right: 1rem;
          padding-left: 1rem;
        }
        .blog-post-content ul > li,
        .blog-post-content ol > li {
          margin-bottom: .4em;
        }
        /* لینک‌ها UX */
        .blog-post-content .prose a {
          word-break: break-all;
          transition: color 0.12s;
        }
        .blog-post-content .prose a:hover {
          color: #06b6d4;
          text-decoration: underline;
        }
        /* بهبود لرنری برای جهت RTL (فارسی) */
        .blog-post-content {
          direction: rtl;
        }
        .blog-post-content .prose li {
          padding-right: .5ch;
        }
      `}</style>
    </div>
  );
}
