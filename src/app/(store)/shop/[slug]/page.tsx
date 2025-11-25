import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LikeButton from "./LikeButton";
import { FaWhatsapp, FaTelegramPlane, FaInstagram } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

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

const OFFICE_PHONE = "021-12345678";
const TELEGRAM_LINK = "https://t.me/yourstore";
const WHATSAPP_LINK = "https://wa.me/989123456789";
const INSTAGRAM_LINK = "https://instagram.com/yourstore";

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
      { cache: "no-store" }
    );
    if (!res.ok)
      return {
        title: "محصول پیدا نشد | فروشگاه",
        description: "چنین محصولی وجود ندارد.",
      };
    const data = await res.json();
    const product = data.product as Product;

    return {
      title: `${product.name} | ${
        product.brand ? product.brand + " | " : ""
      }فروشگاه اینترنتی خرید آنلاین`,
      description:
        product.description?.slice(0, 170) ??
        `${product.name} را با بهترین قیمت و ضمانت از ما خریداری کنید. جهت سفارش با ما تماس بگیرید.`,
      openGraph: {
        title: product.name,
        description: product.description ?? "",
        images: product.image
          ? [{ url: product.image, alt: product.name }]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description ?? "",
        images: product.image ? [product.image] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/${product.slug}`,
      },
    };
  } catch {
    return { title: "خطا در دریافت محصول | فروشگاه" };
  }
}

interface IProductProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: IProductProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let product: Product | null = null;
  let errorMsg = "";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${decodedSlug}`,
      { cache: "no-store" }
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

  if (errorMsg || !product) {
    return (
      <main className="py-20 min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
        <div className="bg-white rounded-3xl border p-8 shadow-2xl text-center max-w-md w-full animate-fade-in">
          <h1 className="text-3xl font-extrabold mb-4 text-red-600">
            {errorMsg}
          </h1>
          <p className="text-gray-500 mb-7">
            لطفاً بعداً تلاش کنید یا به{" "}
            <Link href="/shop" className="text-primary underline font-semibold">
              لیست محصولات
            </Link>{" "}
            بازگردید.
          </p>
          <Link
            href="/shop"
            className="py-2 px-6 rounded bg-primary text-white transition hover:bg-primary/90 font-bold shadow-lg"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      </main>
    );
  }

  // خرید از طریق پیام‌رسان یا تلفن
  const buyOptions = [
    {
      href: WHATSAPP_LINK,
      label: "خرید در واتساپ",
      icon: <FaWhatsapp className="text-2xl" />,
      color: "bg-[#25D366]/95 hover:bg-[#25D366] text-white",
    },
    {
      href: TELEGRAM_LINK,
      label: "پیام به تلگرام",
      icon: <FaTelegramPlane className="text-2xl" />,
      color: "bg-[#229ED9]/90 hover:bg-[#229ED9] text-white",
    },
    {
      href: INSTAGRAM_LINK,
      label: "پیام اینستاگرام",
      icon: <FaInstagram className="text-2xl" />,
      color:
        "bg-gradient-to-tr from-pink-500 to-yellow-400 hover:opacity-80 text-white",
    },
  ];

  return (
    <>
      <main className="container mx-auto px-2 md:px-6 py-4 md:py-14 flex flex-col md:flex-row-reverse items-start gap-6 md:gap-14 relative min-h-[75vh]">
        {/* Product Image Side - Now visually first on mobile, with a beautiful card */}
        <section
          className="
            w-full md:w-[490px] flex flex-col items-center 
            order-[-1] md:order-none 
            mb-3 md:mb-0
          "
        >
          <div className="
            relative w-full flex flex-col items-center
            rounded-2xl border border-gray-100 shadow-md bg-gradient-to-tr from-white to-gray-50
            p-3 md:p-0
            max-w-[440px] mx-auto
          ">
            {product.image ? (
              <div className="w-full flex justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={440}
                  height={440}
                  className="object-contain bg-white rounded-xl shadow
                    border aspect-square transition-transform duration-300
                    md:mt-3 md:mb-3
                    mt-0 mb-2
                    "
                  priority
                  style={{
                    maxHeight: 370,
                  }}
                />
              </div>
            ) : (
              <div className="w-[300px] h-[300px] flex flex-col items-center justify-center bg-gray-100 text-gray-400 rounded-xl border-2 border-dashed my-2">
                <span className="text-6xl mb-3">🖼️</span>
                <span className="text-base">تصویری وجود ندارد</span>
              </div>
            )}
            {/* Like button for desktop - sticky */}
            <div className="hidden md:block absolute top-4 right-4 z-20">
              <Suspense>
                <LikeButton
                  productId={product._id}
                  productName={product.name}
                />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Like button for mobile */}
        <div className="block md:hidden fixed z-40 bottom-5 right-4 left-4 pointer-events-none">
          <div className="pointer-events-auto backdrop-blur-lg bg-white/70 border rounded-xl shadow-2xl p-3 flex items-center justify-center">
            <LikeButton productId={product._id} productName={product.name} />
          </div>
        </div>

        {/* Info Side */}
        <section className="flex-1 w-full md:max-w-[620px]">
          <div className="mb-4 md:mb-5 flex flex-row flex-wrap items-center gap-2 md:gap-3 justify-between">
            <h1 className="w-full md:w-auto text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-dark tracking-tight drop-shadow-sm leading-snug break-words">
              {product.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 items-center mb-5 md:mb-6">
            {product.brand && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs md:text-sm shadow border border-blue-100 font-medium">
                برند: <span className="font-bold">{product.brand}</span>
              </span>
            )}
            {product.category && (
              <span className="bg-green-50 text-green-800 px-2 py-0.5 rounded-md text-xs md:text-sm shadow border border-green-100 font-medium">
                دسته‌بندی: <span className="font-bold">{product.category}</span>
              </span>
            )}
            {product.createdAt && (
              <span className="bg-gray-50 text-gray-500 border px-2 py-0.5 border-gray-100 rounded-md text-[11px] md:text-xs font-medium shadow-sm">
                تاریخ:{" "}
                {new Date(product.createdAt).toLocaleDateString("fa-IR")}
              </span>
            )}
            <span className="bg-gradient-to-r from-primary to-primary/75 text-white px-2 py-0.5 rounded-md text-xs md:text-[13px] font-mono tracking-wider border border-primary shadow">
              کد: {product.modelNumber || product._id.slice(-5)}
            </span>
          </div>

          <div className="bg-white/95 rounded-xl border p-4 md:p-5 shadow mb-5 md:mb-6">
            <h2 className="font-bold text-base text-primary mb-2 flex items-center gap-2">
              <svg width="16" height="16" className="inline-block">
                <circle cx="8" cy="8" r="8" fill="#2563eb" />
              </svg>
              توضیحات محصول
            </h2>
            <p className="text-gray-700 font-medium text-base md:text-lg leading-7 md:leading-8">
              {product.description?.trim() || "بدون توضیح برای این محصول"}
            </p>
          </div>

          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="bg-gray-50/90 rounded-lg border shadow-md mb-6 md:mb-7 overflow-hidden">
                <div className="px-4 py-2 bg-primary/90 text-white font-bold text-base md:text-lg border-b">
                  جدول مشخصات فنی
                </div>
                <table className="min-w-full text-right text-gray-800 bg-white text-xs md:text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <tr
                          key={key}
                          className="border-b first:border-t last:border-b-0 hover:bg-primary/5 transition-colors"
                        >
                          <td className="py-2 md:py-3 px-3 md:px-4 font-bold bg-gray-50 w-2/6 min-w-[120px] md:min-w-[160px]">
                            {key}
                          </td>
                          <td className="py-2 md:py-3 px-2 break-words">{value}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* Call to actions for buy */}
          <div className="mt-7 md:mt-8">
            <div className="font-bold text-base md:text-lg mb-2 md:mb-3 text-primary-dark flex items-center gap-2">
              <FiPhone className="text-lg md:text-xl" />
              راه‌های خرید و استعلام قیمت
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {buyOptions.map((opt) => (
                <a
                  href={opt.href}
                  key={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 md:px-4 md:py-2 font-bold shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition text-sm md:text-base " +
                    opt.color
                  }
                  aria-label={opt.label + " برای خرید محصول"}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </a>
              ))}
              <a
                href={`tel:${OFFICE_PHONE.replace(/\D/g, "")}`}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 md:px-4 md:py-2 font-bold bg-white border border-primary/30 shadow hover:bg-gray-50 transition text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                aria-label={`تماس با فروشگاه برای خرید (${OFFICE_PHONE})`}
              >
                <FiPhone className="text-base md:text-lg" />
                <span>تلفن: {OFFICE_PHONE}</span>
              </a>
            </div>
            <span className="block text-gray-400 mt-2 text-xs md:text-sm">
              پس از ارسال پیام یا تماس، کد یا نام محصول را اعلام فرمایید.
            </span>
          </div>
        </section>
      </main>

      {/* Similar Products */}
      {product.similarProducts && product.similarProducts.length > 0 && (
        <section className="container mx-auto px-2 md:px-4 py-8 md:py-12 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-5 md:mb-8 pl-2">
            <div className="w-1.5 h-8 bg-primary rounded-xl"></div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-primary-dark">
              محصولات مشابه
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-7">
            {product.similarProducts.map((similar) => (
              <Link
                key={similar._id}
                href={`/shop/${similar.slug}`}
                className="rounded-2xl border border-gray-100 hover:shadow-lg p-3 md:p-4 transition-all block bg-white group relative hover:-translate-y-1"
              >
                <div className="flex items-center justify-center mb-2 md:mb-3 min-h-[100px] md:min-h-[130px]">
                  {similar.image ? (
                    <Image
                      src={similar.image}
                      alt={similar.name}
                      width={110}
                      height={110}
                      className="object-contain rounded-lg transition-transform duration-300 group-hover:scale-105 bg-white aspect-square"
                    />
                  ) : (
                    <div className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg border text-sm md:text-lg">
                      تصویری ندارد
                    </div>
                  )}
                </div>
                <div className="font-bold mb-0.5 md:mb-1 text-gray-900 truncate text-[0.95rem] md:text-[1.04rem]">
                  {similar.name}
                </div>
                {similar.brand && (
                  <span className="block text-[11px] md:text-xs text-gray-500 mb-0.5">
                    برند: {similar.brand}
                  </span>
                )}
                {similar.category && (
                  <span className="block text-[11px] md:text-xs text-green-600">
                    {similar.category}
                  </span>
                )}
                <span className="absolute top-1.5 left-2 bg-primary/10 text-primary px-2 py-0.5 text-xs rounded-full font-mono">
                  {similar.modelNumber ?? similar._id.slice(-5)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
