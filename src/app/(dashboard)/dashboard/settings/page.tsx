"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Shield, Mail, Key, LogOut } from "lucide-react";
import ChangeEmailModal from "./_components/ChangeEmailModal";
import ResetPasswordModal from "./_components/ResetPasswordModal";
import LogoutConfirmModal from "./_components/LogoutConfirmModal";

export default function SettingsPage() {
  const user = useSelector((state: RootState) => state.user);

  const [emailModal, setEmailModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  return (
    <main className="min-h-screen bg-[#f9fafc] px-4 py-10 font-vazir text-gray-800">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        {/* Header */}
        <header className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-cyan-500" />
          <h1 className="text-xl sm:text-2xl font-bold">تنظیمات حساب کاربری</h1>
        </header>

        {/* Change Email */}
        <section className="card">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-500" />
            <h2 className="font-semibold">تغییر ایمیل</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            ایمیل فعلی: <span className="font-medium">{user?.email}</span>
          </p>
          <button
            onClick={() => setEmailModal(true)}
            className="btn-primary mt-4"
          >
            تغییر ایمیل
          </button>
        </section>

        {/* Change Password */}
        <section className="card">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-500" />
            <h2 className="font-semibold">امنیت حساب</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            رمز عبور خود را دوره‌ای تغییر دهید تا امنیت حساب افزایش یابد.
          </p>
          <button
            onClick={() => setPasswordModal(true)}
            className="btn-primary mt-4"
          >
            تغییر رمز عبور
          </button>
        </section>

        {/* Logout */}
        <section className="card border-red-300">
          <button
            onClick={() => setLogoutModal(true)}
            className="flex items-center gap-2 text-red-600 font-semibold"
          >
            <LogOut className="w-5 h-5" />
            خروج از حساب
          </button>
        </section>
      </div>

      {/* Modals */}
      <ChangeEmailModal
        open={emailModal}
        onClose={() => setEmailModal(false)}
      />
      <ResetPasswordModal
        open={passwordModal}
        onClose={() => setPasswordModal(false)}
      />
      <LogoutConfirmModal
        open={logoutModal}
        onClose={() => setLogoutModal(false)}
      />
    </main>
  );
}
