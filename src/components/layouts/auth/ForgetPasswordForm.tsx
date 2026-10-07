"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiSend,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { z } from "zod";
import InputField from "./InputField";
import {
  getAuthErrorMessage,
  extractAuthErrorFromResponse,
} from "./authErrorUtils";

// اسکیمای ولیدیشن شماره موبایل ایران
const forgotPasswordSchema = z.object({
  phoneNumber: z
    .string("شماره تلفن همراه الزامی است")
    .transform((val) =>
      val.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()),
    )
    .pipe(
      z
        .string()
        .regex(
          /^(?:(?:\+98|0098|98)?[0]?|0)?9\d{9}$/,
          "شماره تلفن همراه نامعتبر است (مثال: 09123456789)",
        ),
    ),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: data.phoneNumber }),
      });

      if (!res.ok) {
        const errorMessage = await extractAuthErrorFromResponse(res);
        setServerError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      toast.success("کد بازیابی رمز عبور با موفقیت پیامک شد");
      setSubmittedPhone(data.phoneNumber);
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // حالت موفقیت‌آمیز و هدایت به صفحه بازنشانی
  if (submittedPhone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-5 py-4"
      >
        <div className="flex justify-center">
          <div className="bg-emerald-100 p-3.5 rounded-full ring-8 ring-emerald-50">
            <FiCheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-800">کد پیامک شد!</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            کد تأیید بازیابی رمز عبور به شماره{" "}
            <span className="font-bold text-slate-800 font-mono" dir="ltr">
              {submittedPhone}
            </span>{" "}
            ارسال گردید.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/reset-password?phone=${encodeURIComponent(submittedPhone)}`,
              )
            }
            className="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <span>ورود کد و تنظیم رمز جدید</span>
            <FiArrowRight className="w-4 h-4 rotate-180" />
          </button>

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 py-1 transition-colors"
          >
            بازگشت به صفحه ورود
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* پیام خطای سرور */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-3"
          >
            <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-red-800 mb-0.5">خطا</p>
              <p className="text-xs text-red-700 leading-relaxed wrap-break-word">
                {serverError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
              aria-label="بستن"
            >
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center text-xs text-slate-500">
        شماره تلفن همراه حسابتان را وارد کنید تا کد بازیابی برایتان پیامک شود.
      </div>

      {/* فیلد ورودی شماره موبایل */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 }}
      >
        <InputField
          label="شماره تلفن همراه"
          type="tel"
          register={register("phoneNumber")}
          error={errors.phoneNumber?.message}
        />
      </motion.div>

      {/* دکمه ارسال */}
      <motion.button
        type="submit"
        disabled={loading}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`
          w-full py-3 sm:py-3.5 rounded-xl font-bold text-white text-sm sm:text-base
          transition-all duration-200 flex items-center justify-center gap-2 shadow-md
          ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 shadow-primary/20 hover:shadow-lg active:scale-[0.99]"
          }
        `}
      >
        {loading ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            <span>در حال ارسال پیامک...</span>
          </>
        ) : (
          <>
            <FiSend className="w-4 h-4" />
            <span>ارسال کد بازیابی</span>
          </>
        )}
      </motion.button>

      <div className="text-center pt-1">
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors inline-block"
        >
          انصراف و بازگشت به ورود
        </Link>
      </div>
    </form>
  );
}
