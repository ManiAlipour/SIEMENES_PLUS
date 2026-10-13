"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShield, FiArrowRight } from "react-icons/fi";
import AuthForm from "@/components/layouts/auth/AuthForm";
import { type AuthMode } from "@/components/layouts/auth/authSchemas";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [savedPhone, setSavedPhone] = useState<string>("");

  // هر بار که مودال مجدداً باز می‌شود، مد به مقدار اولیه ریست شود
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSavedPhone("");
    }
  }, [isOpen, initialMode]);

  // مدیریت قفل کامل اسکرول ویوپورت
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, onClose]);

  const handleSwitchMode = (nextMode: AuthMode, phone?: string) => {
    if (phone) setSavedPhone(phone);
    setMode(nextMode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* پس‌زمینه بلور */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            onWheel={(e) => e.preventDefault()}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-all"
          />

          {/* بدنه شیشه‌ای مودال */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-cyan-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-900/10 z-10 overflow-hidden"
          >
            {/* هدر هوشمند بر اساس Mode */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {mode === "verify" ? (
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center"
                    title="بازگشت به ثبت‌نام"
                  >
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-inner">
                    <FiShield className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {mode === "login"
                      ? "ورود به زیمنس‌پلاس"
                      : mode === "register"
                        ? "عضویت در زیمنس‌پلاس"
                        : "تأیید شماره تلفن"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mode === "verify"
                      ? "کد پیامک‌شده را وارد کنید"
                      : "لطفاً اطلاعات خود را وارد کنید"}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="بستن"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* بدنه فرم */}
            <div className="max-h-[75vh] overflow-y-hidden pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <AuthForm
                mode={mode}
                phoneNumberProp={savedPhone}
                onSuccess={onClose}
                onSwitchMode={handleSwitchMode}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
