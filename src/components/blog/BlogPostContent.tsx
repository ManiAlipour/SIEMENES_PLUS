"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ProductCard = dynamic(
  () => import("@/components/features/ProductCard").then((m) => m.default),
  { ssr: false },
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

type Segment = { type: "html"; value: string } | { type: "product"; blockId: string };

function parseContentWithEmbeds(html: string): Segment[] {
  const segments: Segment[] = [];
  // Match div with blog-product-embed and data-block-id (attributes can be in any order)
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
    const id = typeof productId === "string" ? productId : (productId as any)?.toString?.();
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

  const id = typeof product._id === "string" ? product._id : (product._id as any)?.toString?.() ?? productId;

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

  return (
    <div className="blog-post-content" dir="auto">
      {segments.map((seg, i) => {
        if (seg.type === "html") {
          return (
            <div
              key={i}
              dir="auto"
              className="prose prose-slate max-w-none prose-headings:font-bold prose-img:rounded-xl prose-a:text-cyan-600"
              dangerouslySetInnerHTML={{ __html: seg.value }}
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
    </div>
  );
}
