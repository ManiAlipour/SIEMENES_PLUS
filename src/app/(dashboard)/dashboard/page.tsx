"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

export default function UserDashboardPage() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <main className="min-h-screen bg-[#f9fafc] font-vazirmatn text-gray-800 flex flex-col gap-6 md:gap-8 p-4 sm:p-6 lg:p-10 transition-all">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-20 rounded-xl p-3 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white/80 backdrop-blur-md border-b border-cyan-100/60 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <h1 className="text-lg sm:text-xl font-bold text-gray-700 text-center sm:text-right">
          پنل کاربری <span className="text-cyan-600">زیمنس پلاس</span>
        </h1>
        <span className="text-xs sm:text-sm text-gray-500 italic text-center sm:text-left">
          Siemens Plus Control Center
        </span>
      </header>

      {/* ===== Welcome section ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-4 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-lg border border-cyan-100/40 shadow-[0_5px_15px_-3px_rgba(0,255,255,0.06)] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
      >
        <FaUser
          size={80}
          className="mx-auto sm:mx-0 rounded-full ring-4 ring-cyan-300/30 shadow-lg"
        />
        <div className="text-center sm:text-right">
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-600">
            👋 سلام {user.name}!
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base leading-relaxed">
            خوش اومدی به حساب کاربری خودت در{" "}
            <span className="text-cyan-600 font-semibold">زیمنس‌پلاس</span>.
          </p>
        </div>
      </motion.div>

      {/* ===== Info cards ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <UserInfoCard label="نقش" value="کاربر عادی" />
        <UserInfoCard
          label="وضعیت تأیید"
          value={user.verified ? "تأیید شده ✅" : "در انتظار تأیید 🔸"}
        />
        <UserInfoCard label="ایمیل" value={user.email} />
        <UserInfoCard
          label="تاریخ عضویت"
          value={new Date(user.createdAt).toLocaleDateString("fa-IR")}
        />
        <UserInfoCard label="آخرین ورود" value="۱۴۰۴/۰۸/۱۵ – ۱۰:۳۲ ق.ظ" />
        <UserInfoCard label="پشتیبانی فعال" value="آنلاین ✅" />
      </section>

      {/* ===== Action cards ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 sm:mt-4"
      >
        <DashboardActionCard
          icon="👤"
          title="پروفایل"
          description="ویرایش اطلاعات شخصی و عکس کاربری"
        />
        <DashboardActionCard
          icon="📑"
          title="گزارش‌ها"
          description="مشاهده آخرین فعالیت‌ها و گزارش‌های ارسال‌شده"
        />
        <DashboardActionCard
          icon="🧱"
          title="پروژه‌های من"
          description="مشاهده و مدیریت پروژه‌هایی که ثبت کردی"
        />
      </motion.div>
    </main>
  );
}

/* ===== Sub Components ===== */

// کارت اطلاعات
function UserInfoCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-[0_6px_20px_-3px_rgba(0,255,255,0.1)] hover:border-cyan-400/40 transition-all"
    >
      <h3 className="text-xs sm:text-sm text-gray-500 mb-1">{label}</h3>
      <p className="text-base sm:text-lg font-semibold text-cyan-600 break-all">
        {value}
      </p>
    </motion.div>
  );
}

// کارت اکشن
function DashboardActionCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-4 sm:p-6 rounded-2xl bg-white shadow-[0_5px_20px_-3px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_10px_25px_-4px_rgba(0,255,255,0.25)] hover:border-cyan-400/50 transition-all duration-300 cursor-pointer flex flex-col items-center sm:items-start text-center sm:text-right"
    >
      <span className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-cyan-500">
        {icon}
      </span>
      <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 text-gray-800">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
