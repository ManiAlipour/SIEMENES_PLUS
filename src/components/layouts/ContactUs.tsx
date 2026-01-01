"use client";

import { motion } from "framer-motion";
import {
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
  FaLinkedinIn,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdSend } from "react-icons/md";
import ContactForm from "./ContactForm";

export default function ContactUs() {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-950">
      {/* ---------------- BACKGROUND EFFECTS ---------------- */}

      {/* Deep Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-0" />

      {/* Grid Pattern - Engineering Feel */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient Glow Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative container mx-auto px-6 max-w-7xl z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* ---------------- LEFT SIDE: INFO & CONTENT ---------------- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              تماس با ما
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              آماده همکاری در <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                پروژه‌های صنعتی شما
              </span>
            </h2>

            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
              تیم فنی ما آماده پاسخگویی به سوالات شما در زمینه اتوماسیون صنعتی،
              درایو و تجهیزات زیمنس می‌باشد.
            </p>

            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <ContactCard
                icon={<MdPhone />}
                title="تماس تلفنی"
                value="09199883772"
                href="tel:09199883772"
              />
              <ContactCard
                icon={<MdEmail />}
                title="ایمیل سازمانی"
                value="siemensplus8020@gmail.com"
                href="mailto:siemensplus8020@gmail.com"
              />
              <ContactCard
                icon={<FaWhatsapp />}
                title="واتس‌اپ پشتیبانی"
                value="09199883772"
                href="https://wa.me/09199883772"
              />
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-cyan-400 text-xl">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">آدرس دفتر</p>
                  <p className="text-sm text-slate-200 font-medium">
                    قزوین، شهر صنعتی البرز
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <p className="text-slate-500 text-sm ml-2">ما را دنبال کنید:</p>
              <SocialBtn icon={<FaInstagram />} href="#" />
              <SocialBtn icon={<FaTelegramPlane />} href="#" />
              <SocialBtn icon={<FaLinkedinIn />} href="#" />
            </div>
          </motion.div>

          {/* ---------------- RIGHT SIDE: CONTACT FORM ---------------- */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

// --- Sub-components for cleaner code ---

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const Content = (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all cursor-pointer group">
      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-1">{title}</p>
        <p className="text-sm text-slate-200 font-medium font-mono dir-ltr text-right">
          {value}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {Content}
    </a>
  ) : (
    Content
  );
}

function SocialBtn({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
