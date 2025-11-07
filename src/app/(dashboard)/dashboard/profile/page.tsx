"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import { UserCircle, Lock } from "lucide-react";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user) as UserRedux;

  return (
    <main className="min-h-screen bg-[#f9fafc] text-gray-800 font-vazirmatn px-4 py-10 sm:px-8 lg:px-12 transition-all">
      {/* ===== Header ===== */}
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-cyan-100/60 bg-white/70 backdrop-blur-md rounded-xl shadow-[0_2px_10px_-4px_rgba(0,255,255,0.1)] p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700 flex items-center gap-2">
          <UserCircle className="text-cyan-500 w-6 h-6" />
          پروفایل من
        </h1>
        <span className="text-sm text-gray-500 italic">
          نسخه Lux White Refined
        </span>
      </header>

      {/* ===== اطلاعات کاربر ===== */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white/60 backdrop-blur-xl border border-cyan-100/40 p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_-6px_rgba(0,255,255,0.1)] flex flex-col lg:flex-row gap-8 sm:gap-10"
      >
        <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-linear-to-tr from-cyan-300 to-cyan-100 flex items-center justify-center text-white shadow-lg ring-4 ring-cyan-300/30">
            <UserCircle size={50} className="text-cyan-700" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-cyan-600 mt-4">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span className="text-xs mt-2 text-gray-400">
            نقش: {user.role === "admin" ? "مدیر سیستم" : "کاربر عادی"} • وضعیت:{" "}
            {user.verified ? "تأیید شده ✅" : "در انتظار تأیید 🔸"}
          </span>
        </div>

        {/* ===== جدول اطلاعات ===== */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ReadOnlyField label="شناسه کاربر" value={user.id} />
          <ReadOnlyField label="نقش کاربری" value={user.role} />
          <ReadOnlyField
            label="تاریخ عضویت"
            value={new Date(user.createdAt).toLocaleDateString("fa-IR")}
          />
          <ReadOnlyField
            label="آخرین بروزرسانی"
            value={new Date(user.updatedAt).toLocaleDateString("fa-IR")}
          />
        </div>
      </motion.section>

      {/* ===== بخش امنیت ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-10 bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6"
      >
        <div className="flex items-center gap-3 text-gray-700">
          <Lock className="text-cyan-500 w-5 h-5" />
          <div>
            <h3 className="font-bold">امنیت حساب کاربری</h3>
            <p className="text-sm text-gray-500 mt-1">
              رمز عبور خود را به طور منظم تغییر دهید تا حساب شما ایمن بماند.
            </p>
          </div>
        </div>
        <button
          onClick={() => alert("فرم تغییر رمز عبور فعال می‌شود")}
          className="px-5 py-2.5 rounded-xl border border-cyan-400 text-cyan-600 font-semibold hover:bg-cyan-500 hover:text-white shadow-sm transition-all"
        >
          ویرایش رمز عبور
        </button>
      </motion.section>
    </main>
  );
}

/* ===== کامپوننت نمایش فقط‌ خواندنی ===== */
interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      <label className="text-sm sm:text-base text-gray-600">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        readOnly
        className="w-full rounded-xl border border-gray-200/80 bg-white/60 backdrop-blur-sm px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none shadow-[0_2px_6px_rgba(0,0,0,0.04)] opacity-70 cursor-not-allowed"
      />
    </div>
  );
}
