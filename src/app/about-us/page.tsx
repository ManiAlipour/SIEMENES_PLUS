"use client";
import { motion } from "framer-motion";
import Image from "next/image";

// 🎛 Siemens Plus – About Page (Lux Final + Depth Zoning + Card Layout)
export default function AboutPage() {
  return (
    <main className="text-gray-800 overflow-hidden">
      {/* ---------- HERO SECTION ---------- */}
      <section className="relative py-24 text-center bg-linear-to-b from-[#f9feff] via-[#e8faff] to-[#d9f5ff]">
        <motion.h1
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-primary"
        >
          درباره ما
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-6 text-lg max-w-2xl mx-auto text-gray-600"
        >
          شرکت Siemens Plus با ترکیب دقت مهندسی و طراحی لوکس صنعتی، مهارت و
          فناوری را در خدمت بهره‌وری صنعتی قرار می‌دهد.
        </motion.p>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,188,212,0.07),transparent)] pointer-events-none" />
      </section>

      {/* ---------- VALUE CARDS SECTION ---------- */}
      <section className="py-20 bg-[#f3fbfe] relative isolate">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,188,212,0.03)_0%,rgba(0,121,194,0.06)_100%)]" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 relative">
          {[
            {
              title: "دقت مهندسی",
              text: "ترکیب فناوری زیمنس و کیفیت ساخت بالا برای دستیابی به عملکرد بی‌نقص.",
            },
            {
              title: "نوآوری مستمر",
              text: "حرکت پیوسته به سمت آینده با پذیرش فناوری‌های نو و طراحی‌های خلاق.",
            },
            {
              title: "تعهد و اطمینان",
              text: "ساخت رابطه‌ای پایدار با مشتریان از طریق پشتیبانی مؤثر و مهندسی قابل‌اعتماد.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/70 backdrop-blur-lg shadow-[0_8px_35px_rgba(0,121,194,0.15)] p-8 border border-white/30"
            >
              <h3 className="text-xl font-semibold text-[#0079C2] mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- SALES SECTION (CARD) ---------- */}
      <section className="py-24 bg-linear-to-r from-[#e6faff] via-[#dff6fc] to-[#f4fdff] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 md:px-12 relative"
        >
          <div className="relative order-1PP md:order-1">
            <Image
              src="/images/logo.jpg"
              alt="Siemens Plus Sales"
              width={640}
              height={420}
              className="rounded-2xl shadow-[0_15px_45px_rgba(0,121,194,0.35)]"
            />
          </div>

          {/* 🧩 Text — پایین در موبایل، راست در دسکتاپ */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2 md:order-2 rounded-2xl bg-white/60 backdrop-blur-xl p-10 shadow-[0_10px_40px_rgba(0,188,212,0.25)]"
          >
            <h2 className="text-3xl font-bold text-primary mb-6 relative">
              فروش
              <span className="absolute bottom-0 left-0 w-16 h-1 rounded-full bg-linear-to-r from-[#00BCD4] to-[#0079C2]" />
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              مجموعه‌ی زیمنس پلاس با تمرکز بر فروش و تعمیرات تخصصی محصولات
              زیمنس، به عنوان یکی از پیشگامان در این حوزه شناخته می‌شود. این
              مجموعه با بهره‌گیری از کارشناسان مجرب و تجهیزات پیشرفته، خدماتی با
              کیفیت بالا و مطابق با استانداردهای جهانی ارائه می‌دهد.
            </p>
            <p className="text-gray-600 leading-relaxed">
              زیمنس پلاس با ارائه‌ی مشاوره‌های فنی و راهکارهای نوآورانه، تلاش
              می‌کند تا نیازهای مشتریان خود را به بهترین شکل ممکن برآورده کند.
              همچنین، این مجموعه با تعهد به رضایت مشتری و پشتیبانی قوی، به ایجاد
              روابط بلندمدت با مشتریان خود اهمیت می‌دهد.شرکت مهندسی زیمنس پلاس
              یکی از نمایندگان معتبر و خوش‌نام در زمینه فروش و ارائه خدمات پس از
              فروش قطعات زیمنس است. این شرکت با بهره‌گیری از تخصص و تجربه‌ی تیم
              مهندسی خود، به مشتریان در انتخاب و خرید بهترین قطعات و تجهیزات
              صنعتی کمک می‌کند. زیمنس پلاس به عنوان یک پل ارتباطی بین تولیدکننده
              و مصرف‌کننده، با ارائه مشاوره‌های فنی و تخصصی، نصب و راه‌اندازی، و
              همچنین خدمات تعمیر و نگهداری، نقش مهمی در بهبود عملکرد صنایع مختلف
              ایفا می‌کند. تعهد به کیفیت و رضایتمندی مشتریان، از اولویت‌های اصلی
              این شرکت است که باعث شده است تا در میان رقبا جایگاه ویژه‌ای داشته
              باشد.
            </p>
          </motion.div>
        </motion.div>

        {/* subtle glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(0,188,212,0.08),transparent)]" />
      </section>

      {/* ---------- REPAIRS SECTION (CARD with flipped layout) ---------- */}
      <section className="py-24 bg-linear-to-l from-[#e8faff] via-[#dff3f9] to-[#f8feff] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 75 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6 md:px-12 relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2 md:order-1 rounded-2xl bg-white/60 backdrop-blur-xl p-10 shadow-[0_10px_40px_rgba(0,121,194,0.25)]"
          >
            <h2 className="text-3xl font-bold text-primary mb-6 relative">
              تعمیرات
              <span className="absolute bottom-0 left-0 w-16 h-1 rounded-full bg-linear-to-r from-[#00BCD4] to-[#0079C2]" />
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              تعمیرات تخصصی زیمنس یکی از حوزه‌های مهم و دقیق در بخش خدمات فنی و
              مهندسی است که نیازمند دانش و تجربه زیادی در زمینه محصولات و
              تکنولوژی‌های این شرکت معتبر آلمانی می‌باشد.
            </p>
            <p className="text-gray-600 leading-relaxed">
              تعمیرات تخصصی این محصولات نیازمند شناخت کامل از ساختار و عملکرد
              آن‌ها، به‌همراه توانایی تشخیص دقیق مشکلات و ارائه راه‌حل‌های سریع
              و مؤثر است. تکنسین‌های مجرب ما دراین حوزه  با استفاده از ابزارهای
              پیشرفته و تکنولوژی‌های نوین، خدمات تعمیر و نگهداری را با بالاترین
              استانداردهای ممکن ارائه می‌دهند.
            </p>
          </motion.div>
          <div className="order-1 md:order-2 relative">
            <Image
              src="/images/team-industrial.png"
              alt="Siemens Plus Repair"
              width={640}
              height={420}
              className="rounded-2xl shadow-[0_15px_45px_rgba(0,121,194,0.3)]"
            />
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(0,121,194,0.08),transparent)]" />
      </section>

      {/* ---------- CTA SECTION ---------- */}
      <section className="relative py-24 text-center bg-linear-to-r from-[#0079C2] via-[#009CCD] to-[#00BCD4] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent)]" />
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-8 relative z-10"
        >
          آماده‌ای برای گام بعدی با  Siemens Plus؟
        </motion.h3>
        <motion.a
          href="/contact-us"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-block px-10 py-3 bg-white text-[#0079C2] font-semibold rounded-full shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] transition-all duration-300 relative z-10"
        >
          تماس با ما
        </motion.a>
      </section>
    </main>
  );
}
