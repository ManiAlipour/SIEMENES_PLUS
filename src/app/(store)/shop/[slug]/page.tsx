import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LikeButton from "./LikeButton";
import { FaWhatsapp, FaTelegramPlane, FaInstagram } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import CommentsSection from "@/components/features/CommentsSection";

// --- Types ---
type ProductObject = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  modelNumber: string;
  image: string;
  description: string;
  specifications: Record<string, string>;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
type Product = ProductObject & {
  similarProducts: ProductObject[];
};

const OFFICE_PHONE = "09199883772";
const TELEGRAM_LINK = "https://t.me/yourstore";
const WHATSAPP_LINK = "https://wa.me/989199883772";
const INSTAGRAM_LINK = "https://instagram.com/siemenes.plus1";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${decodedSlug}`,
      { cache: "no-store" },
    );
    if (!res.ok)
      return {
        title: "محصول پیدا نشد | فروشگاه",
        description: "چنین محصولی وجود ندارد.",
        robots: { index: false, follow: false },
      };
    const data = await res.json();
    const product = data.product as Product;

    // Schema.org Product
    const productLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      brand: product.brand,
      name: product.name,
      description: product.description?.slice(0, 300),
      image: product.image,
      sku: product.modelNumber || product._id.slice(-5),
      category: product.category,
      releaseDate: product.createdAt,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/${product.slug}`,
    };

    return {
      title: `${product.name} | ${
        product.brand ? product.brand + " | " : ""
      }خرید آنلاین`,
      description:
        product.description?.slice(0, 170) ??
        `${product.name} را با بهترین قیمت و ضمانت از ما خریداری کنید.`,
      openGraph: {
        title: product.name,
        description: product.description || "",
        images: product.image
          ? [{ url: product.image, alt: product.name }]
          : [],
        // Fix here: Use a valid type for OpenGraph (e.g. 'website', 'article', or 'product.group'). 'product' is not valid in Next.js 13+.
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description || "",
        images: product.image ? [product.image] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/${product.slug}`,
      },
      robots: { index: true, follow: true },
      other: {
        "x-product-jsonld": JSON.stringify(productLd),
      },
    };
  } catch {
    return { title: "خطا در دریافت محصول | فروشگاه" };
  }
}

interface IProductProps {
  params: Promise<{ slug: string }>;
}

// NEW: Helper – Lazy Aspect Ratio Container (SEO + performance image strategy)
function LazyProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg w-full aspect-square bg-gradient-to-tr from-gray-200 via-gray-100 to-white flex items-center justify-center">
      <Image
        src={src}
        alt={alt}
        fill={false}
        width={360}
        height={360}
        className="object-contain w-full h-full transition-transform duration-200 group-hover:scale-105"
        loading="eager"
        priority
        sizes="(max-width: 640px) 90vw, 33vw"
      />
    </div>
  );
}

function SpecTable({ specs }: { specs: Record<string, string> }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm mb-7 overflow-x-auto">
      <table className="min-w-full text-right text-gray-700 text-xs sm:text-sm divide-y divide-gray-100">
        <thead>
          <tr>
            <th
              className="bg-primary/90 text-white py-2 px-3 font-bold"
              colSpan={2}
            >
              جدول مشخصات فنی
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(specs).map(([k, v]) => (
            <tr key={k} className="hover:bg-primary/5 transition-colors">
              <th className="py-2 px-2 font-semibold whitespace-nowrap w-32 sm:w-40">
                {k}
              </th>
              <td className="py-2 px-2 break-words">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main component
export default async function ProductPage({ params }: IProductProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let product: Product | null = null;
  let errorMsg = "";

  try {
    // fetch only essential field, edge cache for performance on SSG
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${decodedSlug}`,
      { cache: "force-cache", next: { tags: ["product", decodedSlug] } },
    );
    if (!res.ok) {
      errorMsg = "محصول پیدا نشد!";
    } else {
      const data = await res.json();
      product = data.product;
    }
  } catch {
    errorMsg = "خطا در دریافت اطلاعات محصول";
  }

  // Error Screen – SEO friendly
  if (errorMsg || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 to-white">
        <div className="bg-white/95 border rounded-xl shadow-xl p-7 و-full max-w-md mx-auto animate-fade-in text-center">
          <h1 className="text-red-600 text-2xl font-bold mb-2">{errorMsg}</h1>
          <p className="text-gray-600 mb-5 text-base">
            متاسفانه محصول موردنظر پیدا نشد. لطفا{" "}
            <Link href="/shop" className="text-primary underline font-semibold">
              بازگشت به فروشگاه
            </Link>
          </p>
          <Link
            href="/shop"
            className="inline-block mt-2 px-5 py-2 rounded bg-primary text-white font-bold shadow hover:bg-primary/90 transition"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      </main>
    );
  }

  // Purchase via messenger or phone (mobile-friendly)
  const buyOptions = [
    {
      href: WHATSAPP_LINK,
      label: "واتساپ",
      icon: <FaWhatsapp className="text-xl" />,
      color: "bg-[#25D366] hover:bg-[#25D366]/80 text-white",
      aria: "خرید از طریق واتساپ",
    },
    {
      href: TELEGRAM_LINK,
      label: "تلگرام",
      icon: <FaTelegramPlane className="text-xl" />,
      color: "bg-[#229ED9] hover:bg-[#229ED9]/90 text-white",
      aria: "خرید از طریق تلگرام",
    },
    {
      href: INSTAGRAM_LINK,
      label: "اینستاگرام",
      icon: <FaInstagram className="text-xl" />,
      color:
        "bg-gradient-to-tr from-pink-500 to-yellow-400 hover:opacity-85 text-white",
      aria: "خرید از طریق اینستاگرام",
    },
  ];

  // --- MAIN UI ---
  return (
    <>
      {/* SEO: JSON-LD Product for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.image,
            description: product.description?.slice(0, 300),
            brand: { "@type": "Brand", name: product.brand },
            sku: product.modelNumber || product._id.slice(-5),
            category: product.category,
            releaseDate: product.createdAt,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/${product.slug}`,
          }),
        }}
      />

      <main className="max-w-3xl mx-auto w-full min-h-screen px-2 xs:px-3 sm:px-4 md:px-0 py-2 md:py-8 animate-fade-in-up">
        {/* Product Card SECTION (UX mobile first) */}
        <section className="rounded-2xl shadow-lg border border-gray-100 bg-white/95 p-3 md:p-6 flex flex-col md:flex-row gap-6 md:gap-8 relative">
          {/* Product Image – sticky on md+ */}
          <div className="w-full md:w-[350px] flex-none flex flex-col gap-3 items-center md:items-start md:sticky md:top-24">
            <div className="group w-full max-w-[320px] mx-auto">
              {product.image ? (
                <LazyProductImage src={product.image} alt={product.name} />
              ) : (
                <div className="flex items-center justify-center aspect-square w-full min-h-[220px] bg-gray-50 rounded-lg border text-gray-300 font-bold text-6xl">
                  <span aria-label="بدون تصویر" role="img">
                    🖼️
                  </span>
                </div>
              )}

              {/* Like Button (desktop only) */}
              <div className="hidden md:block absolute top-3 left-3 z-20">
                <Suspense>
                  <LikeButton
                    productId={product._id}
                    productName={product.name}
                  />
                </Suspense>
              </div>
            </div>
          </div>

          {/* INFO SIDE */}
          <div className="flex-1 flex flex-col justify-between gap-4 w-full">
            {/* TITLE & TAGS */}
            <div className="gap-2">
              <h1
                className="text-primary-dark text-2xl xs:text-3xl md:text-4xl font-black leading-tight mb-2"
                itemProp="name"
              >
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {product.brand && (
                  <span className="bg-blue-50 text-blue-900 text-xs px-2 py-0.5 rounded shadow-sm font-medium">
                    برند: <span className="font-bold">{product.brand}</span>
                  </span>
                )}
                {product.category && (
                  <span className="bg-green-50 text-green-800 text-xs px-2 py-0.5 rounded shadow-sm font-medium">
                    {product.category}
                  </span>
                )}
                <span className="bg-gradient-to-r from-primary to-primary/80 text-white px-2 py-0.5 rounded text-xs font-mono tracking-widest border border-primary shadow">
                  کد: {product.modelNumber || product._id.slice(-5)}
                </span>
                {product.createdAt && (
                  <span className="text-gray-400 text-[11px] border border-gray-100 bg-gray-50 rounded-md px-2 py-0.5 mx-1">
                    {new Date(product.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                )}
              </div>
            </div>

            {/* LIKE BUTTON (MOBILE) */}
            <div className="fixed md:hidden bottom-3 left-0 right-0 px-3 flex justify-center z-30">
              <div className="pointer-events-auto backdrop-blur bg-white/90 border rounded-xl shadow-xl p-2 flex items-center">
                <LikeButton
                  productId={product._id}
                  productName={product.name}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="my-2">
              <h2 className="text-base font-bold text-primary mb-1 flex items-center gap-2">
                <svg width="15" height="15">
                  <circle cx="7.5" cy="7.5" r="7.5" fill="#2563eb" />
                </svg>
                توضیحات محصول
              </h2>
              <p
                className="text-gray-700 font-medium text-base leading-7 break-words mb-1"
                itemProp="description"
              >
                {product.description?.trim() || "بدون توضیح برای این محصول"}
              </p>
            </div>

            {/* SPECIFICATIONS (mobile friendly table) */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <SpecTable specs={product.specifications} />
              )}

            {/* ACTIONS */}
            <nav
              className="flex flex-col gap-2 mt-5"
              aria-label="راه‌های خرید و ارتباط"
            >
              <div className="font-bold flex items-center gap-2 text-primary-dark text-base md:text-lg mb-1">
                <FiPhone className="text-lg" />
                خرید سریع یا استعلام قیمت
              </div>
              <div className="w-full flex flex-row flex-wrap justify-start gap-2">
                {buyOptions.map((opt) => (
                  <a
                    key={opt.href}
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-row items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold shadow transition hover:scale-[.98] focus:outline-none focus:ring-2 focus:ring-primary ${opt.color}`}
                    aria-label={opt.aria}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </a>
                ))}
                <a
                  href={`tel:${OFFICE_PHONE.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold bg-white border border-primary/30 text-primary text-sm shadow hover:bg-primary/5 transition focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`تماس با شماره فروشگاه (${OFFICE_PHONE})`}
                >
                  <FiPhone className="text-sm" />
                  <span>{OFFICE_PHONE}</span>
                </a>
              </div>
              <div className="text-xs text-gray-400 mt-1 px-1 text-left">
                جهت خرید/استعلام، کد یا نام محصول را ذکر نمایید.
              </div>
            </nav>
          </div>
        </section>

        <CommentsSection targetId={product._id} targetType="product" />

        {/* ~~ SIMILAR PRODUCTS ~~ */}
        {product.similarProducts && product.similarProducts.length > 0 && (
          <section
            className="mt-12 sm:mt-16 animate-fade-in-up"
            aria-label="محصولات مشابه"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-6">
              <span className="w-1.5 h-6 rounded bg-primary" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-primary-dark drop-shadow">
                محصولات مشابه
              </h2>
            </div>
            <div className="scroll-x pb-2 px-1 hide-scrollbar">
              <ul className="flex flex-row gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory">
                {product.similarProducts.map((sp) => (
                  <li
                    key={sp._id}
                    className="snap-center w-[140px] sm:w-[160px] md:w-[188px] flex-shrink-0"
                  >
                    <Link
                      href={`/shop/${sp.slug}`}
                      className="group block rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg p-3 sm:p-4 bg-white transition-all relative hover:-translate-y-1 h-full"
                      title={sp.name}
                    >
                      <div className="flex items-center justify-center mb-2 min-h-[88px] md:min-h-[110px]">
                        {sp.image ? (
                          <Image
                            src={sp.image}
                            alt={sp.name}
                            width={100}
                            height={100}
                            className="object-contain aspect-square rounded-lg bg-gray-50 transition-all group-hover:scale-105"
                            sizes="120px"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-[82px] h-[82px] md:w-[100px] md:h-[100px] flex items-center justify-center bg-gray-50 text-gray-300 rounded-lg border text-2xl">
                            🖼️
                          </div>
                        )}
                      </div>
                      <div className="truncate font-bold text-gray-900 text-[14px] mb-0.5">
                        {sp.name}
                      </div>
                      {sp.brand && (
                        <span className="block text-[11px] text-gray-500">
                          {sp.brand}
                        </span>
                      )}
                      {sp.category && (
                        <span className="block text-[11px] text-green-700">
                          {sp.category}
                        </span>
                      )}
                      <span className="absolute top-2 left-3 bg-primary/10 text-primary px-1.5 py-0.5 text-[11px] rounded-full font-mono">
                        {sp.modelNumber ?? sp._id.slice(-5)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
