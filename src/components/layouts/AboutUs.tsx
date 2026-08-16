import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
  return (
    <section
      className="relative overflow-hidden bg-white py-16 md:py-24"
      aria-labelledby="about-us-heading"
    >
      <div className="container mx-auto grid max-w-7xl items-stretch gap-0 px-0 md:grid-cols-2 md:px-6">
        <div className="relative min-h-[280px] md:min-h-[420px]">
          <Image
            src="/images/team-industrial.webp"
            alt="تیم فنی زیمنس پلاس"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col justify-center bg-[#f3f5f7] px-5 py-10 sm:px-8 md:px-10 md:py-12">
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-primary">
            درباره ما
          </p>
          <h2
            id="about-us-heading"
            className="text-2xl font-black text-slate-900 md:text-3xl"
          >
            زیمنس پلاس
          </h2>
          <p className="mt-1 text-sm text-slate-500">SIEMENS PLUS</p>

          <p className="mt-5 text-[15px] leading-8 text-slate-700">
            مجموعه فنی‌مهندسی زیمنس پلاس از سال ۱۳۹۵ تحت مدیریت{" "}
            <Link
              href="/about-us/morteza-majidi"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              مهندس مرتضی مجیدی
            </Link>{" "}
            فعالیت می‌کند؛ فروش و تعمیرات تخصصی کنترل‌ها، درایوها، انکودرها و
            خط‌کش‌های زیمنس.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            اعتماد مشتریان ما حاصل شفافیت، پشتیبانی فنی و تجهیزات اورجینال با
            گارانتی معتبر است.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/about-us"
              className="inline-flex min-h-[44px] items-center bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              بیشتر بدانید
            </Link>
            <Link
              href="/about-us/morteza-majidi"
              className="inline-flex min-h-[44px] items-center border border-slate-300 px-6 text-sm font-bold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              پروفایل مرتضی مجیدی
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
