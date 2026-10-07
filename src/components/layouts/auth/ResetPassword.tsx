"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiLoader, FiAlertCircle, FiX } from "react-icons/fi";
import Link from "next/link";
import InputField from "./InputField";

const toEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());

const resetSchema = z
  .object({
    code: z
      .string()
      .min(1, "کد تأیید الزامی است")
      .transform(toEnglishDigits)
      .refine((val) => /^\d{6}$/.test(val), "کد تأیید باید ۶ رقم باشد"),
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const phone = searchParams.get("phone");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  if (!phone) {
    return (
      <div className="text-center py-6 px-4 space-y-4">
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl p-4 text-xs leading-relaxed">
          شماره تلفن همراه یافت نشد. لطفاً از طریق لینک فراموشی رمز عبور اقدام
          کنید.
        </div>
        <Link
          href="/forgot-password"
          className="inline-block py-2.5 px-6 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all"
        >
          درخواست مجدد کد
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          code: data.code,
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "خطایی در عملیات رخ داد");
      }

      toast.success("رمز عبور با موفقیت تغییر کرد");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* راهنما و شماره موبایل */}
      <div className="text-center text-xs text-slate-500 dark:text-zinc-400">
        کد پیامک‌شده به شماره{" "}
        <span
          className="font-bold text-slate-700 dark:text-primary font-mono"
          dir="ltr"
        >
          {phone}
        </span>{" "}
        را وارد نمایید.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center justify-between gap-3 text-red-400 text-xs"
            >
              <div className="flex items-center gap-2">
                <FiAlertCircle className="shrink-0 text-base" />
                <span>{serverError}</span>
              </div>
              <button
                type="button"
                onClick={() => setServerError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <InputField
          label="کد تأیید ۶ رقمی"
          type="text"
          dir="ltr"
          placeholder="123456"
          register={register("code")}
          error={errors.code?.message}
        />

        <InputField
          label="رمز عبور جدید"
          type="password"
          register={register("password")}
          error={errors.password?.message}
        />

        <InputField
          label="تکرار رمز عبور"
          type="password"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 sm:py-3.5 rounded-xl font-bold text-white text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2
            ${loading ? "bg-zinc-700 cursor-not-allowed" : "bg-primary hover:bg-primary/90 shadow-primary/20"}
          `}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin text-lg" />
              <span>در حال به‌روزرسانی...</span>
            </>
          ) : (
            "تغییر و ورود به حساب"
          )}
        </motion.button>
      </form>
    </div>
  );
}
