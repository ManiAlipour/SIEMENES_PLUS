"use client";
import Image from "next/image";

// About Us section with brand accent, image, and brief description
const AboutUs = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-[#f6f8fa] border-t border-[#004c97]/10">
      {/* Vertical brand accent on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#004c97]/80 rounded-l-lg"></div>

      <div className="container mx-auto grid md:grid-cols-2 gap-14 items-center px-6 md:px-10">
        {/* Technical team image */}
        <div className="flex justify-center md:justify-start order-1 md:order-2">
          <div
            className="rounded-xl overflow-hidden shadow-[0_8px_25px_rgba(0,76,151,0.1)] border border-[#004c97]/20 w-full max-w-[500px]
           aspect-4/3 ring-1 ring-[#004c97]/10"
          >
            <Image
              src="/images/team-industrial.png"
              alt="تیم فنی زیمنس پلاس | SIEMENS PLUS"
              width={900}
              height={600}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* About content (RTL text) */}
        <div className="order-2 md:order-1 text-right">
          <span className="text-sm font-vazir-medium text-[#004c97] tracking-wide uppercase border-b border-[#004c97]/30 pb-1">
            درباره ما
          </span>
          <h2 className="text-3xl md:text-4xl font-vazir-bold text-[#004c97] mt-3 mb-5">
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
            href="/about"
            className="inline-block mt-8 text-sm font-vazir-medium text-white bg-[#004c97] px-6 py-2.5 rounded-full hover:shadow-[0_0_18px_rgba(0,76,151,0.4)] hover:bg-[#003d7a] transition-all duration-300"
          >
            بیشتر بدانید
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
