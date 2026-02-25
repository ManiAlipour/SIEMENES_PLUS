"use client";
import Image from "next/image";

// About Us section with brand accent, image, and brief description
const AboutUs = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-slate-50 border-t border-primary/10" aria-labelledby="about-us-heading">
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-primary/80 rounded-l-lg" aria-hidden />
      <div className="container mx-auto grid md:grid-cols-2 gap-14 items-center px-6 md:px-10">
        <div className="flex justify-center md:justify-start order-1 md:order-2">
          <div
            className="rounded-xl overflow-hidden shadow-lg border border-primary/20 w-full max-w-[500px] aspect-4/3 ring-1 ring-primary/10"
          >
            <Image
              src="/images/team-industrial.png"
              alt="تیم فنی زیمنس پلاس | SIEMENS PLUS"
              width={900}
              height={600}
              className="object-cover w-full h-full"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>

        <div className="order-2 md:order-1 text-right">
          <span className="text-sm font-vazir-medium text-primary tracking-wide uppercase border-b border-primary/30 pb-1">
            درباره ما
          </span>
          <h2 id="about-us-heading" className="text-3xl md:text-4xl font-bold text-primary mt-3 mb-5">
            زیمنس پلاس{" "}
            <span className="block text-gray-500 text-lg">SIEMENS PLUS</span>
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-[15px]">
            مجموعه‌ی فنی مهندسی زیمنس پلاس در سال ۱۴۰۳ تحت مدیریت مهندس مرتضی
            مجیدی فعالیت خود را اغاز نموده. این مجموعه با بهره‌گیری از دانش فنی
            به‌روز و تیمی متخصص، در زمینه‌هایی مانند فروش وتعمیرات تخصصی قطعات
            زیمنس از جمله سیستم‌ کنترل ها و درایوها ،انکودرها وخط کش ها ...
            فعالیت می‌کند.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            اعتماد مشتریان ما حاصل شفافیت، پشتیبانی فنی دائمی و ارائه تجهیزات
            اورجینال با گارانتی معتبر است.
          </p>

          <a
            href="/about-us"
            className="inline-block mt-8 text-sm font-vazir-medium text-white bg-primary px-6 py-2.5 rounded-full hover:shadow-lg hover:bg-primary/90 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="مطالعه بیشتر درباره زیمنس پلاس"
          >
            بیشتر بدانید
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
