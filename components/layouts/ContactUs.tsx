"use client";

import { motion } from "framer-motion";
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

export default function ContactUs() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* پس‌زمینهٔ گرادیانی با پترن */}
      <div
        className="absolute inset-0
       bg-linear-to-br from-[#0b1730] via-[#002b59] to-[#004c97]"
      />

      {/* شبکهٔ خطوط نوری پس‌زمینه */}
      <div
        className="absolute inset-0 opacity-[0.15]
       bg-[radial-gradient(#00a9e0_1px,transparent_1px)] bg-size-[40px_40px]"
      />

      <div className="relative container mx-auto grid md:grid-cols-2 gap-12 px-6 items-center z-10">
        {/* سمت اطلاعات */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-[#00a9e0]">
            ارتباط با ما
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed text-[15px]">
            در صورت نیاز به مشاوره، ثبت سفارش یا خدمات تخصصی زیمنس، از راه‌های
            زیر با ما در تماس باشید.
          </p>

          <ul className="space-y-4 font-medium mb-10">
            <li className="flex items-center gap-3">
              <MdPhone className="text-[#00cfb9] text-xl" />
              <span className="text-white">۰۲۱‑xxxxxxxx</span>
            </li>
            <li className="flex items-center gap-3">
              <MdEmail className="text-[#00cfb9] text-xl" />
              <span className="text-white">info@siemens‑plus.com</span>
            </li>
          </ul>

          {/* شبکه‌های اجتماعی */}
          <div className="flex gap-5">
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://instagram.com/siemensplus.ir"
              target="_blank"
              className="p-3 rounded-full bg-[#ffffff0d] border border-[#00a9e0]/40
                         shadow-[0_0_10px_#00a9e0aa] text-white hover:bg-[#00a9e0]/20 transition"
            >
              <FaInstagram className="text-2xl" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://t.me/siemensplus"
              target="_blank"
              className="p-3 rounded-full bg-[#ffffff0d] border border-[#00a9e0]/40
                         shadow-[0_0_10px_#00a9e0aa] text-white hover:bg-[#00a9e0]/20 transition"
            >
              <FaTelegramPlane className="text-2xl" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2 }}
              href="https://wa.me/989xxxxxxxxx"
              target="_blank"
              className="p-3 rounded-full bg-[#ffffff0d] border border-[#00a9e0]/40
                         shadow-[0_0_10px_#00a9e0aa] text-white hover:bg-[#00a9e0]/20 transition"
            >
              <FaWhatsapp className="text-2xl" />
            </motion.a>
          </div>
        </motion.div>

        {/* فرم تماس */}
        <motion.form
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={(e) => e.preventDefault()}
          className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-[#00a9e0]/20 shadow-[0_0_40px_#00a9e033]"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-white/70 mb-1">نام</label>
              <input
                className="w-full bg-[#001e3c]/60 border border-[#00a9e0]/30 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-[#00a9e0] outline-none"
                placeholder="مانی ..."
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">ایمیل</label>
              <input
                type="email"
                className="w-full bg-[#001e3c]/60 border border-[#00a9e0]/30 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-[#00a9e0] outline-none"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">پیام</label>
              <textarea
                rows={4}
                className="w-full bg-[#001e3c]/60 border border-[#00a9e0]/30 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-[#00a9e0] outline-none"
                placeholder="متن پیام شما..."
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full bg-[#00a9e0] text-white font-semibold py-2 rounded-md hover:bg-[#0092c8] transition"
            >
              ارسال پیام
            </motion.button>
          </div>
        </motion.form>
      </div>
      {/* در انتهای سکشن ContactUs */}
      <div className="h-10 w-full bg-linear-to-b from-[#002b59] to-[#001a33]" />
    </section>
  );
}
