"use client";

import {
  FaInstagram,
  FaTelegramPlane,
  FaWhatsapp,
  FaLinkedinIn,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import ContactForm from "./ContactForm";

export default function ContactUs() {
  return (
    <section
      className="bg-[#0b1f33] py-16 md:py-20"
      aria-labelledby="contact-us-heading"
    >
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#7ec8e3]">
              تماس با ما
            </p>
            <h2
              id="contact-us-heading"
              className="text-2xl font-black leading-tight text-white md:text-4xl"
            >
              آماده همکاری در پروژه‌های صنعتی شما
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-white/65">
              تیم فنی زیمنس پلاس آماده پاسخگویی در زمینه فروش، تعمیرات و مشاوره
              تجهیزات زیمنس است.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ContactRow
                icon={<MdPhone />}
                title="تماس تلفنی"
                value="09199883772"
                href="tel:09199883772"
              />
              <ContactRow
                icon={<MdEmail />}
                title="ایمیل"
                value="siemensplus8020@gmail.com"
                href="mailto:siemensplus8020@gmail.com"
              />
              <ContactRow
                icon={<FaWhatsapp />}
                title="واتس‌اپ"
                value="09199883772"
                href="https://wa.me/989199883772"
              />
              <div className="flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3.5">
                <span className="text-lg text-[#7ec8e3]" aria-hidden>
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <p className="text-xs text-white/45">آدرس دفتر</p>
                  <p className="text-sm font-medium text-white/90">
                    قزوین، شهر صنعتی البرز
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="text-xs text-white/45">شبکه‌های اجتماعی</span>
              <SocialBtn
                icon={<FaInstagram />}
                href="https://instagram.com/siemens.plus1"
                label="اینستاگرام"
              />
              <SocialBtn icon={<FaTelegramPlane />} href="#" label="تلگرام" />
              <SocialBtn icon={<FaLinkedinIn />} href="#" label="لینکدین" />
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactRow({
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
  const inner = (
    <div className="flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3.5 transition hover:border-white/25 hover:bg-white/[0.06]">
      <span className="text-lg text-[#7ec8e3]" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-white/45">{title}</p>
        <p
          className="truncate text-sm font-medium text-white/90"
          style={{ direction: "ltr", textAlign: "right" }}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

function SocialBtn({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-10 w-10 place-items-center border border-white/15 text-white/60 transition hover:border-white/40 hover:text-white"
    >
      {icon}
    </a>
  );
}
