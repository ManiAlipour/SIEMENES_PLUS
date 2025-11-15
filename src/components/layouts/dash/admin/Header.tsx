"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react"; // ‌‌‌آیکون منو – نیاز به پکیج lucide-react

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-[rgba(255,255,255,0.15)] backdrop-blur-xl border-b border-[rgba(0,255,255,0.25)] shadow-sm">
      {/* لوگو و عنوان */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/images/logo.jpg"
          alt="Siemens Plus Logo"
          width={40}
          height={40}
          className="rounded-full shadow-lg ring-2 ring-cyan-400/40"
        />
        <div className="flex flex-col">
          <span className="font-vazir text-xl font-bold text-cyan-500 tracking-tight">
            <span className="text-black">پنل ادمین </span>
            زیمنس پلاس
          </span>
          <span className="text-xs text-gray-300 font-vazir">
            Siemens Plus Control Center
          </span>
        </div>
      </Link>

      {/* دکمه موبایل */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 text-cyan-400 hover:text-cyan-200 transition-colors"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
