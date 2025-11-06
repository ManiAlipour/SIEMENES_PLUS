import Link from "next/link";
import { FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#002b59] text-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid gap-10 sm:gap-8 md:grid-cols-5">
        {/* Column 1: Quick links */}
        <div>
          <h2 className="font-bold text-lg mb-4 text-[#00a9e0]">
            لینک‌های سریع
          </h2>
          <nav>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-[#4dd0ff]" href="/about">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#4dd0ff]" href="/services">
                  خدمات مهندسی
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#4dd0ff]" href="/products">
                  محصولات
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#4dd0ff]" href="/blog">
                  بلاگ
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#4dd0ff]" href="/contact">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Column 2: Product categories */}
        <div className="md:border-l border-slate-700 md:pl-6">
          <h2 className="font-bold text-lg mb-4 text-[#00a9e0]">
            دسته‌های محصولات
          </h2>
          <ul className="space-y-2 text-sm">
            <li>PLC & Automation</li>
            <li>Drives & Motors</li>
            <li>HMI Panels</li>
            <li>LV Boards</li>
            <li>Sensors & Instruments</li>
          </ul>
        </div>

        {/* Column 3: Office address */}
        <div className="md:border-l border-slate-700 md:pl-6">
          <h2 className="font-bold text-lg mb-4 text-[#00a9e0]">دفتر مرکزی</h2>
          <p className="text-sm leading-6 text-gray-300">
            قزوین-شهرصنعتی البرز-خیابان زکریای رازی -جنب شرکت مهرام پلاک  20
            <br /> تلفن:  09199883772
            <br /> ایمیل: siemensplus8020@gmail.com
          </p>
        </div>

        {/* Column 4: Newsletter + Social links */}
        <div className="md:border-l col-span-2 border-slate-700 md:pl-6">
          <h2 className="font-bold text-lg mb-4 text-[#00a9e0]">خبرنامه</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید..."
              className="flex-1 rounded-md bg-slate-800 px-3 py-2 text-sm border border-slate-600 focus:border-[#00a9e0] outline-none text-gray-200 placeholder-gray-400"
            />
            <button className="px-4 py-2 bg-[#004c97] hover:bg-[#0a5fb9] text-white rounded-md text-sm font-medium">
              عضویت
            </button>
          </div>

          {/* Social media links */}
          <div className="flex gap-4 mt-4 text-xl">
            <Link
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-[#00a9e0]"
              href="#"
            >
              <FaLinkedin />
            </Link>
            <Link
              aria-label="Instagram"
              className="text-gray-400 hover:text-[#00a9e0]"
              href="#"
            >
              <FaInstagram />
            </Link>
            <Link
              aria-label="YouTube"
              className="text-gray-400 hover:text-[#00a9e0]"
              href="#"
            >
              <FaYoutube />
            </Link>
            <Link
              aria-label="WhatsApp"
              className="text-gray-400 hover:text-[#00a9e0]"
              href="#"
            >
              <FaWhatsapp />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-400 text-xs tracking-wide px-4">
        © 2025 SIEMENS PLUS — تمام حقوق محفوظ است
      </div>
    </footer>
  );
}
