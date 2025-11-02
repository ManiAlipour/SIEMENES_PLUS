"use client";
import React from "react";

export default function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* نور و هاله‌های پس‌زمینه */}
      <div className="absolute -top-[15%] -left-[10%] w-[450px] h-[450px] bg-teal-600/25 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] bg-cyan-500/15 blur-[140px] rounded-full"></div>

      {/* کارت اصلی فرم */}
      <div className="relative z-10 w-[92%] max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_0_45px_rgba(0,0,0,0.4)]">
        <h1 className="text-2xl font-semibold text-center mb-8 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300 drop-shadow-[0_1px_8px_rgba(20,184,166,0.5)]">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
