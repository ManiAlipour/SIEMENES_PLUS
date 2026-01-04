import Link from "next/link";
import {
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";

export default function Footer() {
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
              {[
                "PLC & Automation",
                "Drives & Motors",
                "HMI Panels",
                "LV Boards",
                "Sensors",
              ].map((cat) => (
                <li
                  key={cat}
                  className="block hover:text-cyan-400 cursor-pointer transition-colors duration-200"
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter (Spans 4 cols) */}
          <div className="lg:col-span-4 bg-slate-800/30 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
            <h3 className="font-bold text-white text-lg mb-2">
              عضویت در خبرنامه
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              از آخرین تخفیف‌ها و مقالات فنی ما باخبر شوید.
            </p>

            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="ایمیل شما..."
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
              />
              <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center">
                <FaArrowLeft />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <SocialLink href="#" icon={<FaLinkedinIn />} label="LinkedIn" />
              <SocialLink href="#" icon={<FaInstagram />} label="Instagram" />
              <SocialLink href="#" icon={<FaYoutube />} label="YouTube" />
              <SocialLink href="#" icon={<FaWhatsapp />} label="WhatsApp" />
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-right">
            © 2025{" "}
            <span className="text-slate-300 font-bold">SIEMENS PLUS</span> —
            تمامی حقوق محفوظ است.
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
