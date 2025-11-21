"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FiTarget,
  FiZap,
  FiShield,
  FiTrendingUp,
  FiAward,
  FiUsers,
} from "react-icons/fi";

export default function AboutPage() {
  const values = [
    {
      icon: FiTarget,
      title: "دقت مهندسی",
      text: "ترکیب فناوری زیمنس و کیفیت ساخت بالا برای دستیابی به عملکرد بی‌نقص.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FiZap,
      title: "نوآوری مستمر",
      text: "حرکت پیوسته به سمت آینده با پذیرش فناوری‌های نو و طراحی‌های خلاق.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FiShield,
      title: "تعهد و اطمینان",
      text: "ساخت رابطه‌ای پایدار با مشتریان از طریق پشتیبانی مؤثر و مهندسی قابل‌اعتماد.",
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  const stats = [
    { icon: FiAward, label: "سال تجربه", value: "۱۵+", color: "from-blue-500 to-blue-600" },
    { icon: FiUsers, label: "مشتری راضی", value: "۵۰۰+", color: "from-purple-500 to-purple-600" },
    { icon: FiTrendingUp, label: "پروژه موفق", value: "۱۰۰۰+", color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <main className="text-gray-800 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              درباره ما
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full mx-auto mb-6" />
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            شرکت Siemens Plus با ترکیب دقت مهندسی و طراحی لوکس صنعتی، مهارت و
            فناوری را در خدمت بهره‌وری صنعتی قرار می‌دهد.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ارزش‌های ما
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اصولی که ما را به پیش می‌برند
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sales Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative order-2 md:order-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/logo.jpg"
                  alt="Siemens Plus Sales"
                  width={640}
                  height={420}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-gray-200 shadow-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative">
                  فروش
                  <span className="absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    مجموعه‌ی زیمنس پلاس با تمرکز بر فروش و تعمیرات تخصصی محصولات
                    زیمنس، به عنوان یکی از پیشگامان در این حوزه شناخته می‌شود. این
                    مجموعه با بهره‌گیری از کارشناسان مجرب و تجهیزات پیشرفته، خدماتی با
                    کیفیت بالا و مطابق با استانداردهای جهانی ارائه می‌دهد.
                  </p>
                  <p>
                    زیمنس پلاس با ارائه‌ی مشاوره‌های فنی و راهکارهای نوآورانه، تلاش
                    می‌کند تا نیازهای مشتریان خود را به بهترین شکل ممکن برآورده کند.
                    همچنین، این مجموعه با تعهد به رضایت مشتری و پشتیبانی قوی، به ایجاد
                    روابط بلندمدت با مشتریان خود اهمیت می‌دهد.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Repairs Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-2 md:order-1"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 border-2 border-gray-200 shadow-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative">
                  تعمیرات
                  <span className="absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    تعمیرات تخصصی زیمنس یکی از حوزه‌های مهم و دقیق در بخش خدمات فنی و
                    مهندسی است که نیازمند دانش و تجربه زیادی در زمینه محصولات و
                    تکنولوژی‌های این شرکت معتبر آلمانی می‌باشد.
                  </p>
                  <p>
                    تعمیرات تخصصی این محصولات نیازمند شناخت کامل از ساختار و عملکرد
                    آن‌ها، به‌همراه توانایی تشخیص دقیق مشکلات و ارائه راه‌حل‌های سریع
                    و مؤثر است. تکنسین‌های مجرب ما با استفاده از ابزارهای پیشرفته و
                    تکنولوژی‌های نوین، خدمات تعمیر و نگهداری را با بالاترین استانداردهای
                    ممکن ارائه می‌دهند.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="order-1 md:order-2 relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/team-industrial.png"
                  alt="Siemens Plus Repair"
                  width={640}
                  height={420}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 text-center bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto px-4"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            آماده‌ای برای گام بعدی با Siemens Plus؟
          </h3>
          <p className="text-lg text-white/90 mb-8">
            همین حالا با ما تماس بگیر تا پروژه‌اتو شروع کنیم
          </p>
          <Link href="/contact-us">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-primary font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              تماس با ما
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
