"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { LogOut, Shield, Mail, Key, SunMoon } from "lucide-react";

export default function SettingsPage() {
  const user = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState(user?.email ?? "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailChange = async () => {
    alert(`📧 درخواست تغییر ایمیل به: ${email}`);
    // TODO: اتصال به API => /api/users/update-email
  };

  const handlePasswordChange = async () => {
    alert(`🔐 تغییر رمز از "${oldPassword}" به "${newPassword}"`);
    // TODO: اتصال به API => /api/users/update-password
  };

  const handleLogout = () => {
    alert("🚪 خروج از حساب انجام شد!");
    // TODO: اتصال به AuthContext یا /api/logout
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f9fafc] px-4 pt-8 pb-16 font-[Vazirmatn] text-[#374151]">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-[#06b6d4]" />
          <h1 className="text-xl sm:text-2xl font-bold">تنظیمات حساب کاربری</h1>
        </div>

        {/* تغییر ایمیل */}
        <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#06b6d4]" />
            <h2 className="font-semibold">تغییر ایمیل</h2>
          </div>
          <input
            type="email"
            placeholder="ایمیل جدید را وارد کنید"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
          />
          <button
            onClick={handleEmailChange}
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-lg py-2 transition-all duration-300"
          >
            ذخیره تغییرات
          </button>
        </div>

        {/* تغییر رمز عبور */}
        <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-[#06b6d4]" />
            <h2 className="font-semibold">تغییر رمز عبور</h2>
          </div>
          <input
            type="password"
            placeholder="رمز فعلی"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
          />
          <input
            type="password"
            placeholder="رمز جدید"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
          />
          <button
            onClick={handlePasswordChange}
            className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-lg py-2 transition-all duration-300"
          >
            ذخیره رمز جدید
          </button>
        </div>

        {/* تغییر تم */}
        {/* <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold">
            <SunMoon className="h-5 w-5 text-[#06b6d4]" /> حالت نمایش
          </span>
          <button
            onClick={handleThemeSwitch}
            className="text-sm rounded-lg border border-gray-300 px-4 py-2 hover:bg-[#06b6d4]/10 transition-all"
          >
            {themeMode === "light" ? "تیره" : "روشن"}
          </button>
        </div> */}

        {/* خروج از حساب */}
        <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-sm rounded-2xl p-5 sm:p-6 flex flex-col items-center gap-3">
          <LogOut className="h-6 w-6 text-red-500" />
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
}
