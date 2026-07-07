import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FiArrowLeft, FiCalendar, FiTag } from "react-icons/fi";
import CommentsSection from "@/components/features/CommentsSection";
import ContactCTA from "@/components/layouts/ContactCTA";
import ProductBreadcrumb from "@/components/features/product/ProductBreadcrumb";
import ProductGallery from "@/components/features/product/ProductGallery";
import ProductInquiryPanel from "@/components/features/product/ProductInquiryPanel";
import ProductStickyBar from "@/components/features/product/ProductStickyBar";
import ProductTabs from "@/components/features/product/ProductTabs";
import ProductTrustBar from "@/components/features/product/ProductTrustBar";
import SimilarProductsSection from "@/components/features/product/SimilarProductsSection";
import LikeButton from "./LikeButton";
import { getProductBySlug } from "@/lib/products/getProduct";
import {
  buildProductDescription,
  buildProductFaqs,
  buildProductKeywords,
  buildProductTitle,
} from "@/lib/products/productSeo";
import {
  buildBreadcrumbJsonLd,
  buildFAQJsonLd,
  buildProductJsonLd,
} from "@/lib/seo/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return {
        title: "محصول پیدا نشد | فروشگاه زیمنس",
        description: "چنین محصولی در فروشگاه زیمنس وجود ندارد.",
        robots: { index: false, follow: false },
      };
    }

    const title = buildProductTitle(product);
    const description = buildProductDescription(product);
    const keywords = buildProductKeywords(product);
    const productUrl = `${SITE_URL}/shop/${product.slug}`;
    const imageAlt = `${product.name}${product.modelNumber ? ` — کد ${product.modelNumber}` : ""} | محصولات زیمنس`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "fa_IR",
        siteName: SITE_NAME,
        url: productUrl,
        images: product.image
          ? [{ url: product.image, alt: imageAlt, width: 800, height: 800 }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.image ? [product.image] : [],
      },
      alternates: { canonical: `/shop/${product.slug}` },
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: "خطا در دریافت محصول | فروشگاه زیمنس" };
  }
}

interface IProductProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: IProductProps) {
  const { slug } = await params;

  let product: Product | null = null;
  let errorMsg = "";

  try {
    product = await getProductBySlug(slug);
    if (!product) errorMsg = "محصول پیدا نشد!";
  } catch {
    errorMsg = "خطا در دریافت اطلاعات محصول";
  }

  if (errorMsg || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
            🔍
          </div>
          <h1 className="mb-2 text-2xl font-black text-slate-900">
            {errorMsg}
          </h1>
          <p className="mb-6 text-slate-600">
            محصول موردنظر یافت نشد. می‌توانید از فروشگاه جستجو کنید.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow transition hover:bg-primary/90"
          >
            <FiArrowLeft className="h-4 w-4" />
            بازگشت به فروشگاه
          </Link>
        </div>
      </main>
    );
  }

  const productCode = product._id;
  const productUrl = `${SITE_URL}/shop/${product.slug}`;
  const imageAlt = `${product.name}${product.modelNumber ? ` — کد ${product.modelNumber}` : ""} | محصولات زیمنس`;
  const descriptionText =
    product.description?.trim() ||
    `${product.name} — یکی از محصولات ${product.brand || "زیمنس"} در فروشگاه زیمنس پلاس. برای استعلام قیمت، نام محصول یا کد ${productCode} را ارسال کنید.`;
  const specs = (product.specifications || {}) as Record<string, string>;
  const faqs = buildProductFaqs(product, productCode);

  const breadcrumbItems = [
    { name: "خانه", url: SITE_URL },
    { name: "فروشگاه", url: `${SITE_URL}/shop` },
    ...(product.category
      ? [
          {
            name: product.category,
            url: `${SITE_URL}/shop?category=${encodeURIComponent(product.category)}`,
          },
        ]
      : []),
    { name: product.name, url: productUrl },
  ];

  const jsonLd = [
    buildProductJsonLd({
      name: product.name,
      description: product.description,
      image: product.image,
      brand: product.brand,
      modelNumber: product.modelNumber,
      category: product.category,
      slug: product.slug,
      createdAt: product.createdAt,
    }),
    buildBreadcrumbJsonLd(breadcrumbItems),
    buildFAQJsonLd(faqs),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative min-h-screen pb-24 md:pb-12">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/[0.06] to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <ProductBreadcrumb product={product} />

          <article
            itemScope
            itemType="https://schema.org/Product"
            className="space-y-8"
          >
            <section className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5 xl:col-span-5">
                <div className="lg:sticky lg:top-24 space-y-4">
                  <ProductGallery
                    image={product.image}
                    alt={imageAlt}
                    productCode={productCode}
                    brand={product.brand}
                    isFeatured={product.isFeatured}
                  />
                  <div className="hidden lg:block">
                    <ProductTrustBar />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 xl:col-span-7 space-y-6">
                <header className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {product.category && (
                      <Link
                        href={`/shop?category=${encodeURIComponent(product.category)}`}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                        itemProp="category"
                      >
                        <FiTag className="h-3 w-3" aria-hidden />
                        {product.category}
                      </Link>
                    )}
                    {product.createdAt && (
                      <time
                        className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500"
                        dateTime={product.createdAt}
                      >
                        <FiCalendar className="h-3 w-3" aria-hidden />
                        {new Date(product.createdAt).toLocaleDateString(
                          "fa-IR",
                        )}
                      </time>
                    )}
                  </div>

                  <h1
                    className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl lg:text-4xl"
                    itemProp="name"
                  >
                    {product.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5"
                      itemProp="sku"
                    >
                      <span className="text-xs font-medium text-primary/70">
                        کد MLFB
                      </span>
                      <span className="font-mono text-base font-black tracking-wide text-primary">
                        {productCode}
                      </span>
                    </div>
                    {product.brand && (
                      <span
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm"
                        itemProp="brand"
                        itemScope
                        itemType="https://schema.org/Brand"
                      >
                        برند{" "}
                        <span itemProp="name" className="text-primary">
                          {product.brand}
                        </span>
                      </span>
                    )}
                  </div>

                  <p
                    className="text-base leading-8 text-slate-600 line-clamp-3 lg:line-clamp-none"
                    itemProp="description"
                  >
                    {descriptionText}
                  </p>
                </header>

                <div className="hidden md:block">
                  <Suspense>
                    <LikeButton
                      productId={product._id}
                      productName={product.name}
                    />
                  </Suspense>
                </div>

                <ProductInquiryPanel
                  productName={product.name}
                  productId={productCode}
                  productUrl={productUrl}
                />

                <div className="lg:hidden">
                  <ProductTrustBar />
                </div>
              </div>
            </section>

            <ProductTabs
              description={descriptionText}
              specs={specs}
              faqs={faqs}
              productName={product.name}
            />

            <CommentsSection
              targetId={product._id}
              targetType="product"
              title="نظرات و پرسش‌های مشتریان"
            />

            {product.similarProducts && product.similarProducts.length > 0 && (
              <SimilarProductsSection
                products={product.similarProducts}
                category={product.category}
              />
            )}
          </article>
        </div>

        <ContactCTA />

        <ProductStickyBar
          productId={product._id}
          productName={product.name}
          productCode={productCode}
        />
      </main>
    </>
  );
}
