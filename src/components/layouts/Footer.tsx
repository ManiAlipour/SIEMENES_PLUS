import { useFetch } from "iso-hooks";
import Link from "next/link";
import {
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTelegram,
} from "react-icons/fa";

interface ICategories {
  message: string;
  data: ICategory[];
}

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parent: null;
}

export default function Footer() {
  const { data, error, loading, refetch } = useFetch<ICategories>(
    "/api/categories",
    {
      initialData: { data: [], message: "در حال انتظار" },
    }
  );

  return (
    // Main Footer Container with a deep, rich gradient background
    <footer className="w-full bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Column 1: Brand & Contact (Spans 4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              {/* Placeholder for Logo */}
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                SIEMENS <span className="text-cyan-400">PLUS</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              ارائه دهنده پیشرفته‌ترین تجهیزات اتوماسیون صنعتی زیمنس و راهکارهای
              مهندسی دقیق برای صنایع کشور.
            </p>

            {/* Contact Info with Icons */}
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3 text-sm group">
                <FaMapMarkerAlt className="text-cyan-500 mt-1 text-lg group-hover:animate-bounce" />
                <span className="group-hover:text-white transition-colors">
                  قزوین، شهر صنعتی البرز، خیابان زکریای رازی، جنب شرکت مهرام،
                  پلاک 20
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <FaPhoneAlt className="text-cyan-500 group-hover:rotate-12 transition-transform" />
                <span className="font-mono dir-ltr group-hover:text-white transition-colors">
                  0919-988-3772
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <FaEnvelope className="text-cyan-500 group-hover:scale-110 transition-transform" />
                <span className="font-mono group-hover:text-white transition-colors">
                  siemensplus8020@gmail.com
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links (Spans 2 cols) */}
          <div className="lg:col-span-2 lg:pl-4">
            <h3 className="font-bold text-white text-lg mb-6 relative inline-block">
              لینک‌های سریع
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-cyan-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "درباره ما", href: "/about-us" },
                { name: "محصولات", href: "/shop" },
                { name: "بلاگ آموزشی", href: "/blog" },
                { name: "تماس با ما", href: "/contact-us" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-[-4px] transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories (Spans 2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-white text-lg mb-6 relative inline-block">
              محصولات
              <span className="absolute -bottom-2 right-0 w-1/2 h-0.5 bg-cyan-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              {loading ? (
                <div>درحال دریافت</div>
              ) : error ? (
                <div className="text-sm flex flex-col justify-start items-start gap-2 text-warn/90">
                  <p>خطا در دریافت اطلاعات...</p>
                  <button
                    className="text-white/90 bg-meuted/65 px-2 py-1 rounded-lg cursor-pointer"
                    onClick={() => refetch()}
                  >
                    بارگزاری مجدد
                  </button>
                </div>
              ) : (
                data?.data.map((cat) => (
                  <li
                    key={cat._id}
                    className="block hover:text-cyan-400 cursor-pointer transition-colors duration-200"
                  >
                    <Link href={`/shop?category=${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter (Spans 4 cols) */}
          <div className="lg:col-span-4 bg-slate-800/30 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
            <h3 className="font-bold text-white text-lg mb-2">
              مارا دنبال کنید.
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              مارا در صفحات مجازی دنبال کنید.
            </p>

            <div className="flex items-center gap-4">
              <SocialLink href="#" icon={<FaInstagram />} label="Instagram" />
              <SocialLink href="#" icon={<FaTelegram />} label="Telegram" />
              <SocialLink href="#" icon={<FaWhatsapp />} label="WhatsApp" />
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-right">
            {" "}
            © 2025{" "}
            <span className="text-slate-300 font-bold"> SIEMENS PLUS </span> —
            تمامی حقوق محفوظ است.{" "}
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-cyan-400 transition-colors">
              قوانین و مقررات
            </Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors">
              حریم خصوصی
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Component for Social Links
function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-cyan-500 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20"
    >
      {icon}
    </Link>
  );
}
