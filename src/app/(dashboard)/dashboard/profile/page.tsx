"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import { UserCircle, Lock, X, Loader2 } from "lucide-react";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";

const ResetPasswordModal = dynamic(
  () => import("../settings/_components/ResetPasswordModal"),
  { ssr: false },
);
/* =========================
   Profile Page
========================= */
export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user) as UserRedux;
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  return (
    <main className="min-h-screen bg-[#f9fafc] text-gray-800 font-vazir px-4 py-10 sm:px-8 lg:px-12">
      {/* ===== Header ===== */}
      <header className="mb-10 flex items-center justify-between gap-3 border-b border-cyan-100 bg-white/80 backdrop-blur rounded-xl shadow-sm px-4 py-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-700 flex items-center gap-2">
          <UserCircle className="text-cyan-500 w-6 h-6" />
          پروفایل من
        </h1>
        <span className="text-xs text-gray-400">Profile • Secure Area</span>
      </header>

      {/* ===== User Info Card ===== */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white/70 backdrop-blur-xl border border-cyan-100/40 p-6 sm:p-8 rounded-2xl shadow-[0_10px_30px_-6px_rgba(0,255,255,0.12)] flex flex-col lg:flex-row gap-8"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center lg:items-start w-full lg:w-1/3">
          <Avatar name={user.name} />

          <h2 className="text-lg sm:text-xl font-bold text-primary mt-4">
            {user.name}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>

          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
            <span className="font-medium">
              {user.role === "admin" ? "مدیر سیستم" : "کاربر عادی"}
            </span>
            •
            <StatusBadge verified={user.verified} />
          </div>
        </div>

        {/* Info */}
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

      {/* ===== Security ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-10 bg-white/80 backdrop-blur border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6"
      >
        <div className="flex items-center gap-3 text-gray-700">
          <Lock className="text-cyan-500 w-5 h-5" />
          <div>
            <h3 className="font-bold">امنیت حساب کاربری</h3>
            <p className="text-sm text-gray-500 mt-1">
              برای حفظ امنیت، رمز عبور خود را به‌صورت دوره‌ای تغییر دهید.
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenPasswordModal(true)}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 shadow transition-all"
        >
          تغییر رمز عبور
        </button>
      </motion.section>

      {/* Modal */}

      <ResetPasswordModal
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
      />
    </main>
  );
}

/* =========================
   Avatar
========================= */
function Avatar({ name }: { name?: string }) {
  const initial = name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-primary to-highlight flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-cyan-300/30">
      {initial}
    </div>
  );
}

function StatusBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        verified
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {verified ? "تأیید شده ✅" : "در انتظار تأیید 🔸"}
    </span>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-inner">
        {value || "—"}
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
      />
    </div>
  );
}
